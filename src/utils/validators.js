export function emailValid(email) {
    const re = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    let isValid = re.test(email);
    return isValid;
}


export function phoneNumberValidation(phoneNumber) {
    const re = /\+[0-9]+/;
    let isValid = re.test(phoneNumber)
    return isValid
}


export function passMatch(pass, repeatPass) {
    if (pass != repeatPass) {
        return false
    }
    return true
}
