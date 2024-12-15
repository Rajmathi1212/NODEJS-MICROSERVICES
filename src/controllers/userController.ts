import constants from '../common/constants';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel';

dotenv.config();


//create user endpoint
export const createUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'User Register'
    // #swagger.description = 'This endpoint is used to registering the user.'
    try {
        const { user_name, first_name, last_name, email_address, mobile_number, password, gender } = req.body;

        if (!user_name || !first_name || !last_name || !email_address || !mobile_number || !password || !gender) {
            return res.status(400).json({
                succeed: false,
                code: 400,
                status: 'Bad Request',
                message: 'All fields are required.'
            });
        }

        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(409).json({
                succeed: false,
                code: 409,
                status: 'Conflict',
                message: 'Username already exists.'
            });
        }

        const user_id = uuidv4();
        const hash_password = await bcrypt.hash(password, 10);
        const created_on = new Date();

        const user = new User({
            user_id,
            user_name,
            first_name,
            last_name,
            email_address,
            mobile_number,
            password: hash_password,
            gender,
            created_on
        });

        const result = await user.save();
        if (result) {
            return res.status(200).json({
                succeed: true,
                code: 200,
                status: 'Registration successful',
                message: 'User registered successfully'
            });
        }
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Error processing registration.',
        });
    }
}

// Get all user endpoint
export const getAllUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All the Users.'
    // #swagger.description = 'This endpoint is used to get all the users.'

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        const users = await User.find({ is_active: 1 })
            .skip(skip)
            .limit(limit)
            .sort({ created_on: -1 });

        const totalUsers = await User.countDocuments({ is_active: 1 });
        const totalPages = Math.ceil(totalUsers / limit);
        if (users.length > 0) {
            return res.status(200).json({
                succeed: true,
                code: 200,
                status: constants.API_RESPONSE.API_SUCCESS_DATA,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    count: totalUsers,
                    perPage: limit,
                },
                data: users
            });
        } else {
            return res.status(404).json({
                succeed: false,
                code: 404,
                status: constants.API_CODE.API_404,
                message: 'No active users found.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: constants.API_CODE.API_500,
            message: error.message || 'Internal Server Error.',
        });
    }
};

// Get user By Id
export const getUserById = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get the Users By Id.'
    // #swagger.description = 'This endpoint is used to get the users by Id.'

    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({
                succeed: false,
                code: 400,
                status: "Bad Request",
                message: "User ID is required.",
            });
        }
        const user = await User.findOne({ _id: user_id, is_active: 1 });
        if (!user) {
            return res.status(404).json({
                succeed: false,
                code: 404,
                status: "Not Found",
                message: "User not found or inactive.",
            });
        }
        return res.status(200).json({
            succeed: true,
            code: 200,
            status: "Success",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: "Internal Server Error",
            message: error instanceof Error ? error.message : "Error retrieving user by ID.",
        });
    }
}




