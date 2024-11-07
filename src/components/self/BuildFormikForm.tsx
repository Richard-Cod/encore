import AppFormikInput from "./AppFormikInput"

export interface FormikFormInput{
    label : string,
    name : string,
    type? : string,
    TrailIcon? : any
}

export interface FormikFormBuilderProp{
    inputs : FormikFormInput[]
    formik:any
}


function buildFormikForm(formikFormBuilderProp : FormikFormBuilderProp) {
    
  return <>
    {[formikFormBuilderProp.inputs.map((formInputs) =>
     <AppFormikInput 
        label={formInputs.label}
        formik={formikFormBuilderProp.formik}
        name={formInputs.name}
        type={formInputs.type || "text"}
        containerClasses={`col-span-6 ${formInputs.name !== "email" && "sm:col-span-3"}`}
        showPasswordIcon={formInputs.type === "password"} 
        TrailIcon={formInputs.TrailIcon}
        />
    )]}
  </>


}

export default buildFormikForm