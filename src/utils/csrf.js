export function getCSRFToken() {
    let csrftoken = null
    if (document.cookie && document.cookie !== ''){
        const cookies = document.cookie.split(';')
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            if (name === 'csrftoken') {
                csrftoken = value
            }
        })
    }
    return csrftoken
}
