import * as Yup from 'yup';

export const signUp = Yup.object({
    fullName: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required("Please enter your full name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(8).matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Please enter at least 1 special character").required("Please enter your password"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Must match "password" field value').min(8).required("Please enter your confirm password")
});

export const signIn = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(8).required("Please enter your password"),
});
