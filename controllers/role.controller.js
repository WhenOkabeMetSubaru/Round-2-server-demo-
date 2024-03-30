const Role = require('../models/role.model');
const User = require('../models/user.model')

const addNewRoleByAdmin = async (req, res) =>
{
    try
    {

        let roleObj = req.body;

        let roleCreate = new Role(roleObj);

        let finalResult = await roleCreate.save();

        return res.json({
            status: false,
            info: "Role Successfully Created",
            data: finalResult
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}


const getAllRolesByAdmin = async (req, res) =>
{
    try
    {

        let roleDetails = await Role.find({});

        if (!roleDetails?.length > 0)
        {
            return res.status(404).json({
                status: true,
                info: "Roles Not Found"
            })
        }

        return res.json({
            status: false,
            info: "Role Data Found",
            data: roleDetails
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const updateRoleByIDAdmin = async (req, res) =>
{
    try
    {

        let roleObj = req.body;

        let updatedRole  = await Role.findByIdAndUpdate({_id:req.params.roleId},roleObj,{new:true});

        return res.json({
            status: false,
            info: "Role Updated Successfully",
            data: updatedRole
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const deleteRoleByIDAdmin = async (req, res) =>
{
    try
    {

       

        let deletedRole = await Role.findByIdAndDelete({ _id: req.params.roleId },{ new: true });

        return res.json({
            status: false,
            info: "Role Deleted Successfully",
            data: deletedRole
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const addNewRoleToUser = async (req, res) =>
{
    try
    {
        let userDetails = await User.findById({_id:req.params.userId}).populate('roles');

        let isRoleExists = userDetails?.roles?.find((item)=>{
            return item._id == req.params.roleId
        })

       
       
        if(isRoleExists){
            return res.status(400).json({
                status:true,
                info:"Role Already Exists"
            })
        }

        let updatedRoles = await User.findByIdAndUpdate({_id:req.params.userId},{
            $push:{
                roles:req.params.roleId
            }
        },{new:true})

        return res.json({
            status: false,
            info: "User Role Updated Successfully",
            data: updatedRoles
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

const deleteUserRole = async (req, res) =>
{
    try
    {
        let userDetails = await User.findById({ _id: req.params.userId }).populate('roles')

        let isRoleExists = userDetails?.roles?.find((item) =>
        {
            return item._id == req.params.roleId
        })

        

        if (!isRoleExists)
        {
            return res.status(400).json({
                status: true,
                info: "Role Does not Exist"
            })
        }

        let updatedRoles = await User.findByIdAndUpdate({ _id: req.params?.userId }, {
            $pull: {
                roles: req.params.roleId
            }
        }, { new: true })

        return res.json({
            status: false,
            info: "User Role Updated Successfully",
            data: updatedRoles
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: error.message
        })
    }
}

module.exports = {
    addNewRoleByAdmin,
    getAllRolesByAdmin,
    updateRoleByIDAdmin,
    deleteRoleByIDAdmin,
    addNewRoleToUser,
    deleteUserRole
}
