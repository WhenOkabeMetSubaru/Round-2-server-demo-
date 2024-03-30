
const AdminAuthCtrl = require('../auth/auth');
const UserCtrl = require('../controllers/user.controller');
const Router = require('express').Router();



Router.route('/v1/signup')
    .post(UserCtrl.addNewUser);

Router.route('/v1/signin')
    .post(AdminAuthCtrl.signin)

Router.route('/v1/users')
    .get(AdminAuthCtrl.requireSignin, UserCtrl.getAllUsers)

Router.route('/v1/user/single')
    .get(AdminAuthCtrl.requireSignin, UserCtrl.getUserByToken)

Router.route('/v1/user/:userId')
    .get(AdminAuthCtrl.requireSignin, AdminAuthCtrl.hasAuthorization, UserCtrl.getUserByID);

Router.route('/v1/user/update')
    .patch(AdminAuthCtrl.requireSignin, UserCtrl.getUserByTokenPass, UserCtrl.updateUser);

Router.route('/v1/users/all/pagination')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.getAllUsersPagination)

Router.route('/v1/user/:userId/update')
    .patch(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.updateUserByID)

Router.route('/v1/user/:userId/delete')
    .delete(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.deleteUserByID)

module.exports = Router;