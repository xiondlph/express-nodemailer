const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

describe('ExpressNodemailer initialization', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should success initialize', () => {
        const expressNodemailer = require('../index');
        const app = { // express Application object
            use: sinon.spy()
        };

        expressNodemailer(app, {}, {});

        expect(app.use.called).to.equal(true);
        app.should.to.have.property("expressNodemailer");
    });

    it('should correctly pass parameters to nodemailer.createTransport method', () => {
        const nodemailer = require('nodemailer');
        const expressNodemailer = require('../index');

        const createTransportStub = sinon.stub(nodemailer, 'createTransport');
        const options = {
            host: 'smtp.example.com',
            port: 465,
            secure: true,
            auth: {
                user: 'user',
                pass: 'pass'
            }
        };
        const defaults = {
            from: "sender@example.com",
        };

        expressNodemailer({use: () => {}}, options, defaults);

        expect(createTransportStub.called).to.equal(true);
        expect(createTransportStub.args[0][0]).to.eql(options);
        expect(createTransportStub.args[0][1]).to.eql(defaults);
    });

    it('should throw error on calling without arguments', () => {
        const expressNodemailer = require('../index');

        expect(
            () => {expressNodemailer()}
        ).to.throw('Cannot read property \'expressNodemailer\' of undefined');
    });

    it('should throw error on second call', () => {
        const expressNodemailer = require('../index');
        const app = {
            use() {}
        };

        expressNodemailer(app, {}, {});
        expect(
            () => {expressNodemailer(app, {}, {})}
        ).to.throw('ExpressNodemailer already has been Initialized');
    });
});

describe('Sending mail through ExpressNodemailer', () => {
    const nodemailer = require('nodemailer');

    let createTransportStub;
    let res; // Express render method

    before(() => {
        createTransportStub = sinon.stub(nodemailer, 'createTransport');
        res = {
            render: sinon.stub()
        };
    });

    beforeEach(() => {
        createTransportStub.reset();
        res.render.reset();
    });

    it('should success sending email by calling a sendMail method from response', (done) => {
        const expressNodemailer = require('../index');

        res.render.onFirstCall().yieldsRight(null, 'text result');
        res.render.onSecondCall().yieldsRight(null, 'html result');

        createTransportStub.callsFake(() => {
            return {
                sendMail(options) {
                    options.should.to.eql({
                        to: 'user@example.com',
                        subject: 'subject',
                        text: 'text result',
                        html: 'html result'
                    });

                    res.render.callCount.should.to.equal(2);

                    return Promise.resolve();
                }
            };
        });

        expressNodemailer(
            {
                use(handler) {
                    handler(
                        {},
                        res,
                        () => {
                            res.sendMail(
                                'user@example.com',
                                'subject',
                                'path/to/text/template',
                                'path/to/html/template'
                            ).then(() => {
                                done();
                            }).catch(err => {
                                done(err)
                            })
                        }
                    );
                }
            },
            {},
            {}
        );
    });

    it('should success sending email with only text body template', (done) => {
        const expressNodemailer = require('../index');

        res.render.onFirstCall().yieldsRight(null, 'text result');
        res.render.onSecondCall().yieldsRight(null, 'html result');

        createTransportStub.callsFake(() => {
            return {
                sendMail(options) {
                    options.should.to.eql({
                        to: 'user@example.com',
                        subject: 'subject',
                        text: 'text result'
                    });

                    res.render.callCount.should.to.equal(1);

                    return Promise.resolve();
                }
            };
        });

        expressNodemailer(
            {
                use(handler) {
                    handler(
                        {},
                        res,
                        () => {
                            res.sendMail(
                                'user@example.com',
                                'subject',
                                'path/to/text/template',
                                // 'path/to/html/template'
                            ).then(() => {
                                done();
                            }).catch(err => {
                                done(err)
                            })
                        }
                    );
                }
            },
            {},
            {}
        );
    });

    it('should throw error on rendering text body template', (done) => {
        const expressNodemailer = require('../index');
        const error = new Error('text template rendering error');

        res.render.onFirstCall().yieldsRight(error, 'text result');

        expressNodemailer(
            {
                use(handler) {
                    handler(
                        {},
                        res,
                        () => {
                            res.sendMail(
                                'user@example.com',
                                'subject',
                                'path/to/text/template'
                            ).should.eventually.rejectedWith(error).and.notify(done);
                        }
                    );
                }
            },
            {},
            {}
        );
    });

    it('should throw error on rendering html body template', (done) => {
        const expressNodemailer = require('../index');
        const error = new Error('html template rendering error');

        res.render.onFirstCall().yieldsRight(null, 'text result');
        res.render.onSecondCall().yieldsRight(error, 'text result');

        expressNodemailer(
            {
                use(handler) {
                    handler(
                        {},
                        res,
                        () => {
                            res.sendMail(
                                'user@example.com',
                                'subject',
                                'path/to/text/template',
                                'path/to/html/template'
                            ).should.eventually.rejectedWith(error).and.notify(done);
                        }
                    );
                }
            },
            {},
            {}
        );
    });

    it('should get rejected from nodemailer sendMail method', (done) => {
        const expressNodemailer = require('../index');
        const error = new Error('error sending email');

        res.render.onFirstCall().yieldsRight(null, 'text result');
        res.render.onSecondCall().yieldsRight(null, 'text result');

        createTransportStub.callsFake(() => {
            return {
                sendMail() {
                    return Promise.reject(error);
                }
            };
        });

        expressNodemailer(
            {
                use(handler) {
                    handler(
                        {},
                        res,
                        () => {
                            res.sendMail(
                                'user@example.com',
                                'subject',
                                'path/to/text/template',
                                'path/to/html/template'
                            ).should.eventually.rejectedWith(error).and.notify(done);
                        }
                    );
                }
            },
            {},
            {}
        );
    });
});