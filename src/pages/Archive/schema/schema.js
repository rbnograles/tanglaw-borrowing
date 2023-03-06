import * as yup from "yup";

export const documentSchema = yup.object().shape({
    abstract: yup.string().required("Required"),
    binned: yup.bool().required().default(false),
    citations: yup.string().required("Required"),
    department: yup.string().required("Required"),
    documentName: yup.string().required("Required"),
    fileName: yup.string().required("Required"),
    keywords: yup.string().required("Required"),
    publicationDate: yup.string().required("Required"),
    schoolYear: yup.string().required("Required"),
});