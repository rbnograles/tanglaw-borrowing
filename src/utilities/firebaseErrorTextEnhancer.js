export const errorMessageEnhancer = (message) => {
    if(message.includes("invalid-email")) {
        return "Email is required"
    }

    if(message.includes("user-not-found")){
        return "Email does not exist"
    }

    if(message.includes("internal-error")) {
        return "Password is required"
    }

    if(message.includes('wrong-password')) {
        return "Wrong password"
    }
    if(message.includes('auth/email-already-in-use')){
        return "Email is already taken."
    }
    if(message.includes('auth/requires-recent-login')) {
        return "Please re-login in order to proceed."
    }
}