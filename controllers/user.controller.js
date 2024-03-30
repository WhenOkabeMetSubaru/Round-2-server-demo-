const User = require('../models/user.model');
const errorHandler = require('../helpers/errorHandler');
const jwt = require('jsonwebtoken')


const addNewUser = async (req, res) =>
{


    
    try
    {
        let isfound = await User.findOne({ email: req.body.email });

        

        if (isfound)
        {
            return res.status(400).json({
                status: true,
                info: 'Already Exists'
            })
        }
        

        const user = new User(req.body);

        let result =await user.save();

        delete result.hashed_password;
        delete result.salt;

        return res.json({
            status: false,
            info: "User Created Successfully",
            data: result
        })
    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err),

        })
    }
}

const getAllUsers = async (req, res) =>
{
    try
    {

        let users = await User.find().select('_id first_name last_name email updated created roles').populate('roles');
        // console.log(users)
        return res.json({
            status: false,
            info: "User retrieved Successfully",
            data: users
        })


    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}

const getAllUsersPagination = async (req, res) =>
{
    try
    {

        let options = {
            page:+req.query.pageNumber,
            limit:+req.query.pageSize,
            populate:'roles',
            select:'-password -hashed_password -salt'
        }

        let users = await User.paginate({},options)

        if(!users){
            return res.status(404).json({
                status:true,
                info:"No Users Found"
            })
        }
        // console.log(users)
        return res.json({
            status: false,
            info: "User retrieved Successfully",
            data: users
        })


    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}

const getUserByID = async (req, res) =>
{
  
    try
    {



        let user = await User.findById(req.user._id).select('_id name email user_type')
        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({
            status: false,
            info: "User Successfully Retrieved",
            data: user
        })
    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}

const read = async (req, res) =>
{


    req.user.hashed_password = undefined;
    req.user.salt = undefined;

    return res.json({
        status: false,
        info: 'Data retrieving Successful',
        data: req.user
    });
}

const updateUser = async (req, res) =>
{

    

    try
    {

        if (req.user._id?.toString() !== req.body._id)
        {
            return res.status(401).json({
                status: true,
                info: 'User not authorized'
            })
        }

        // let user = args.UserUpdateInput._id;
        // user = extend(user, args.UserUpdateInput);
        // user.updated = Date.now();
        // await user.save();

        delete req.body._id;


        let user = await User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true });
        await user.save();


        return res.json({
            status: false,
            info: 'User updated Successfully',
            data: user
        })

    } catch (err)
    {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) =>
{
    try
    {
        let user = req.user;
        let deletedUser = user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        return res.json({
            status: false,
            info: 'Delete Successfully',
            data: deletedUser
        });

    } catch (err)
    {
        res.status(400).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}


const getUserByToken = async (req, res) =>
{

    try
    {


        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET

        )



        let user = await User.findById(decodedToken._id).select('-password -salt').populate('roles')

        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({
            status: false,
            info: "User Successfully Retrieved",
            data: user
        })
    } catch (err)
    {
        console.log(err)
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}

const getUserByTokenPass = async (req, res, next) =>
{


    try
    {


        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET

        )



        let user = await User.findById(decodedToken._id).select('-password -hashed_password -salt').populate('roles')

        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }

        req.user = user;
        // req.user.hashed_password = undefined;
        // req.user.salt = undefined;
        next();
    } catch (err)
    {
        console.log(err)
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}




module.exports = {
    addNewUser, read, getAllUsers, remove, updateUser, getUserByID, getUserByToken, getUserByTokenPass,getAllUsersPagination
}