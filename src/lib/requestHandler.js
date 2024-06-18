import axios from 'axios'
import { getCSRFToken } from '../utils/csrf'
import.meta.env.VITE_API_URL

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
})


// api.defaults.xsrfCookieName = "csrftoken";
// api.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
	const csrfToken = getCSRFToken()
	if (csrfToken) {
		config.headers['X-CSRFToken'] = csrfToken
	}
	return config
})

export {api}

