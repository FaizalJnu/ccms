import { Request, Response } from "express";
import { lookupStudentByEnrollmentNumber, studentLoginUsingEmailPassword, generateAccessToken, generateHashedPassword, studentSignupUsingEmailPassword, passwordCheck, verifyAccessToken, studentMailVerified } from "./auth.service";
import mailer from "../../utils/mailer";

async function authEnrollmentNumberHandler(
    request: Request,
    response: Response
) {
    const body = request.body;

    try {

        if (body.enrollmentNumber.length !== 9) {
            response.status(400).send({ error: 'Enrollment number should be of 9 characters' });
            return;
        }
        if (!body.enrollmentNumber) {
            response.status(400).send({ error: 'Enrollment number is required' });
            return;
        }

        const student = await lookupStudentByEnrollmentNumber(body.enrollmentNumber);

        if (!student) {
            response.status(404).send({ error: 'Student not found' });
            return;
        }

        if (student.cis_id) {
            response.status(200).send({
                success: true,
                body: {
                    message: 'Login',
                    email: student.cis_id
                }
            });
        }
        else {
            response.status(200).send({
                success: true,
                body: {
                    message: 'Signup'
                }
            })
        }
    } catch (error) {
        console.error('Error in authEnrollmentNumberHandler', error);
        response.status(500).send(error);
    }
}

async function authStudentLoginHandler(
    request: Request,
    response: Response
) {
    const body = request.body;

    try {
        if (!body.email) {
            response.status(400).send({ error: 'Email is required' });
            return;
        }
        if (!body.password) {
            response.status(400).send({ error: 'Password is required' });
            return;
        }

        const student = await studentLoginUsingEmailPassword(body.email);

        if (!student) {
            response.status(404).send({ error: 'Student not found' });
            return;
        }

        if (await passwordCheck(body.password, student.password!)) {
            const accessToken = generateAccessToken(String(student.enrollment_number));
            response.status(200).send({
                success: true,
                body: {
                    message: 'Student login successful',
                    token: accessToken,
                    student: {
                        enrollmentNumber: student.enrollment_number,
                        email: student.cis_id,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        credits: student.credits,
                        in_club_as_team: student.in_club_as_team,
                        in_club_as_member: student.in_club_as_member
                    }
                }
            });
            return;
        }

        response.status(401).send({ error: 'Invalid password or id' });
        return;

    } catch (error) {
        console.error('Error in authStudentLoginHandler', error);
        response.status(500).send(error);
    }
}

async function authStudentSignupHandler(
    request: Request,
    response: Response
) {
    const body = request.body;

    try {
        if (!body.email) {
            response.status(400).send({ error: 'Email is required' });
            return;
        }
        if (!body.password) {
            response.status(400).send({ error: 'Password is required' });
            return;
        }
        if (!body.enrollmentNumber) {
            response.status(400).send({ error: 'Enrollment number is required' });
            return;
        }

        const student = await lookupStudentByEnrollmentNumber(body.enrollmentNumber);

        if (!student) {
            response.status(404).send({ error: 'Student not found' });
            return;
        }
        if (!student.cis_id) {
            response.status(400).send({ error: 'Student email not verified' });
            return;
        }

        if (student.cis_id !== body.email) {
            response.status(400).send({ error: 'Email incorrect' });
            return;
        }

        if (student.password) {
            response.status(400).send({ error: 'Student already registered' });
            return;
        }

        const hash: string = await generateHashedPassword(body.password);

        const newStudent = await studentSignupUsingEmailPassword(body.enrollmentNumber, body.email, hash);
        const accessToken = generateAccessToken(String(newStudent.enrollment_number));

        if (!newStudent) {
            response.status(500).send({ error: 'Error in registering student' });
            return;
        }

        response.status(200).send({
            success: true,
            body: {
                message: 'Student signup successful',
                token: accessToken,
                student: {
                    enrollmentNumber: student.enrollment_number,
                    email: student.cis_id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    credits: student.credits,
                    in_club_as_team: student.in_club_as_team,
                    in_club_as_member: student.in_club_as_member
                }
            }
        });
    } catch (error) {
        console.error('Error in authStudentSignupHandler', error);
        response.status(500).send(error);
    }
}

async function authStudentSignupEmailVerificationLinkSender(
    request: Request,
    response: Response
) {
    const body = request.body;

    if (!body.email) {
        response.status(400).send({ error: 'Email is required' });
        return;
    }

    if (!body.enrollmentNumber) {
        response.status(400).send({ error: 'Enrollment number is required' });
        return;
    }

    const student = await lookupStudentByEnrollmentNumber(body.enrollmentNumber);

    if (!student) {
        response.status(404).send({ error: 'Student not found' });
        return;
    }

    if (student.password) {
        response.status(400).send({ error: 'Student already registered' });
        return;
    }

    if (student.cis_id) {
        response.status(400).send({ error: 'Student email already verified' });
        return;
    }

    //generate url to send in email
    const url = `${process.env.EMAIL_POSTBACK_URL}/auth/studentEmailVerify/?eno=${body.enrollmentNumber}&email=${body.email}&token=${generateAccessToken(body.enrollment_number)}`;

    //send email
    const mailSent = await mailer(body.email, url);

    if (!mailSent) {
        response.status(500).send({ error: 'Error in sending email' });
        return;
    }

    response.status(200).send({ success: true, body: { message: 'Email sent' } });
}

async function authStudentSignupEmailVerificationHandler(
    request: Request,
    response: Response
) {
    const enrollmentNumber = request.query.eno as string;
    const email = request.query.email as string;
    const token = request.query.token as string;

    const decoded = verifyAccessToken(token);

    if (!decoded) {
        response.status(401).send({ error: 'Unauthorized' });
        return;
    }

    const student = await studentMailVerified(enrollmentNumber, email);

    if (!student) {
        response.status(500).send({ error: 'Error in verifying email' });
        return;
    }

    response.status(200).send({ success: true, body: { message: 'Email verified' } });
}

export {
    authEnrollmentNumberHandler,
    authStudentLoginHandler,
    authStudentSignupHandler,
    authStudentSignupEmailVerificationLinkSender,
    authStudentSignupEmailVerificationHandler
}