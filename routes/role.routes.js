
const AdminAuthCtrl = require('../auth/auth');
const UserCtrl = require('../controllers/user.controller');
const RoleCtrl = require('../controllers/role.controller')
const Router = require('express').Router();



Router.route('/v1/role/new')
    .post(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.addNewRoleByAdmin);

Router.route('/v1/role/:roleId/update')
    .patch(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.updateRoleByIDAdmin)

Router.route('/v1/role/all')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.getAllRolesByAdmin)

Router.route('/v1/role/:roleId/delete')
    .delete(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.deleteRoleByIDAdmin)

Router.route('/v1/user/:userId/add/role/:roleId')
    .post(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.addNewRoleToUser)

Router.route('/v1/user/:userId/delete/role/:roleId')
    .patch(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,RoleCtrl.deleteUserRole)



module.exports = Router;