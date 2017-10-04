const app = require('../app');

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

const api = supertest('http://localhost:3000');

let login = null;
let users = null;
describe('Tests', () => {
	
	// Example tests
	//==================================================

	// Login user to the system and fetch access token
	it('Login user', (done) => {
		api.post('/sign-in')
			.send({
				password: 'password',
				email: 'email',
			})
			.then((res) => {
				login = res.body.access_token;
				done();
			}).
			catch(done);
	});

	// Get a list of all users
	it('Get users list', (done) => {
		api.get('/users')
			.set('authorization', login)
			.then((res) => {
				// we expect that there is 6 users. You can check/confirm that in app code.
				expect(res.body.length).to.be.equal(6);
				done();
			}).
		catch(done);
	});
	
	
	
	// Answer tests 
	//=========================================================

	
	// Get an error because entering wrong password
	it('Error because of entering a wrong password', (done) => {
		api.post('/sign-in')
			.send({
				password: 'wrong_password',
				email: 'email',
			})
			.then((res) => {
				// expect there is an error cought for entering a wrong password
				expect(res.body.message).to.be.equal('Wrong password or email');
				done();
			}).
			catch(done);
	});
	
	// Get an error because not entering email
	it('Error because of not entering email', (done) => {
		api.post('/sign-in')
			.send({
				password: 'password',
			})
			.then((res) => {
				// expect that there is an error cought for not entering an email
				expect(res.body.message).to.be.equal('Wrong password or email');
				done();
			}).
			catch(done);
	});
	
	// Get errors while trying to get users list (Missing authorization token)
	it('Get authorization error whlle getting users list', (done) => {
		api.get('/users')
			.set('authorization', 'itsanerror')
			.then((res) => {
				// expect that there is an error caught for missing authorization token
				expect(res.body.message).to.be.equal('Missing authorization token');
				done();
			}).
		catch(done);
	});
	
	// Get an active single user
	it('Get a single user', (done) => {
		api.get('/users/1')
			.set('authorization', login)
			.then((res) => {
				// expect that user_id is 1
				expect(res.body.user_id).to.be.equal(1);
				done();
			}).
		catch(done);
	});
	
	// Get error for missing authorization token while looking for a single user
	it('Get error for authorization while geting a single user', (done) => {
		api.get('/users/1')
			.set('authorization', 'itsanerror')
			.then((res) => {
				// expect that there is an error caught for missing authorization token
				expect(res.body.message).to.be.equal('Missing authorization token');
				done();
			}).
		catch(done);
	});
	
	// Get error for looking at non active single user
	it('Get error for looking at non active single user', (done) => {
		api.get('/users/3')
			.set('authorization', login)
			.then((res) => {
				// expect that there is an error caught for getting non active single user
				expect(res.body.message).to.be.equal('User is not active');
				done();
			}).
		catch(done);
	});
	
	// Get a single user accounts
	it('Get single users accounts', (done) => {
		api.get('/users/1/accounts')
			.set('authorization', login)
			.then((res) => {
				// get a single user
				//expect(res.body.userId).to.be.equal(1);
				useraccount=res.body;
				done();
			}).
		catch(done);
	});
	
	// Get error for looking at accounts of non active single user
	it('Get error for looking at accounts of non active single user', (done) => {
		api.get('/users/3/accounts')
			.set('authorization', login)
			.then((res) => {
				// expect that there is an error caught for trying to get account of non active single user
				expect(res.body.message).to.be.equal('User is not active');
				done();
			}).
		catch(done);
	});
	
	// Get authorization error while looking at accounts of single user
	it('Get authorization error for looking at accounts of single user', (done) => {
		api.get('/users/1/accounts')
			.set('authorization', 'itsanerror')
			.then((res) => {
				// expect that there is an error caught for trying to get account of non active single user
				expect(res.body.message).to.be.equal('Missing authorization token');
				done();
			}).
		catch(done);
	});
	
	// Error for looking for accounts of Evil Timelord
	it('Error getting Evil Timelord accoounts', (done) => {
		api.get('/users/5/accounts')
			.set('authorization', login)
			.then((res) => {
				// expect that there is an error caught for trying to get Evil Timelord accounts
				expect(res.body.message).to.be.equal('Time lords do not have accounts');
				done();
			}).
		catch(done);
	});
	
	// Error for looking for accounts of Good Timelord
	it('Error getting Good Timelord accoounts', (done) => {
		api.get('/users/6/accounts')
			.set('authorization', login)
			.then((res) => {
				// expect that there is an error caught for trying to get Good Timelord accounts
				expect(res.body.message).to.be.equal('Time lords do not have accounts');
				done();
			}).
		catch(done);
	});
	
});