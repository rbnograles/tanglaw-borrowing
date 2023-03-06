import * as yup from "yup";

// min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const profileSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    middleName: yup.string().nullable("Required"),
    department: yup.string().required("Required"),
    suffix: yup.string().nullable("Required"),
    studentNumber: yup.string().required("Required"),
    email: yup.string().email("Please enter a valid email").required("Required"),
    password: yup
        .string()
        .min(6)
        .matches(passwordRules, { message: "Min 6 characters, 1 upper case, 1 lower case and 1 number" })
        .required("Required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Required"),
});