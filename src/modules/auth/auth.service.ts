import prisma from "../../utils/prisma";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";

async function lookupStudentByEnrollmentNumber(enrollment_number: string) {
    return prisma.student.findUnique({
        where: {
            enrollment_number
        }
    });
}

async function studentLoginUsingEmailPassword(cis_id: string) {
    return prisma.student.findFirst({
        where: {
            cis_id
        }
    });
}

async function studentSignupUsingEmailPassword(enrollment_number: string, cis_id: string, password: string) {
    const registerStudent = await prisma.student.update({
        where: {
            enrollment_number
        },
        data: {
            cis_id,
            password
        } 
    })

    return registerStudent;
}

async function studentMailVerified(enrollment_number: string, cis_id: string) {
    const registerStudent = await prisma.student.update({
        where: {
            enrollment_number
        },
        data: {
            cis_id
        }
    })

    return registerStudent;
}

function generateAccessToken(username: string) {
    return jwt.sign( { username: username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1800s' })
}

function verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
}

async function generateHashedPassword(password: string) {
    const hash: string = await bcrypt.hash(password, 10);
    return hash;
}

async function passwordCheck(password: string, hash: string) {
    const res = await bcrypt.compare(password, hash);
    return res;
}

export {
    lookupStudentByEnrollmentNumber,
    studentLoginUsingEmailPassword,
    studentSignupUsingEmailPassword,
    studentMailVerified,
    generateAccessToken,
    verifyAccessToken,
    generateHashedPassword,
    passwordCheck,

}