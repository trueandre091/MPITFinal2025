import FormData from "form-data";

// При использовании настройки "proxy" в package.json
// нужно указывать только путь без домена
const BASE_URL = "/api/auth";

class Auth {
	async login(esiaToken) {
		const formData = new FormData();
		// formData.append("esia_token", esiaToken); временное решение
		formData.append("user_id", esiaToken);

		let response;
		try {
			response = await fetch(`${BASE_URL}/login`, {
				method: "POST",
				body: formData,
			});
		} catch (error) {
			return error.message;
		}
		const responseData = await response.json();
		if (response.status === 200) {
			localStorage.setItem("token", responseData.token);
			console.log(localStorage.getItem("token"));
		}

		return response;
	}

	async register(esiaToken, name, role) {
		const formData = new FormData();
		formData.append("esia_token", esiaToken);
		formData.append("name", name);
		formData.append("role", role);

		let response;
		try {
			response = await fetch(`${BASE_URL}/register`, {
				method: "POST",
				body: formData,
			});
		} catch (error) {
			return error.message;
		}

		return response;
	}

	async bot() {
		const token = localStorage.getItem("token");
		let response;
		try {
			response = await fetch(`${BASE_URL}/bot`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			return error.message;
		}
		return response;
	}

	async me() {
		const token = localStorage.getItem("token");
		let response;
		try {
			response = await fetch(`${BASE_URL}/me`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			localStorage.removeItem("token");
			return error.message;
		}

		if (response.status === 401) {
			localStorage.removeItem("token");
			return "Время сессии истекло или неверный токен";
		}

		return response;
	}

	async logout() {
		const token = localStorage.getItem("token");
		let response;
		try {
			response = await fetch(`${BASE_URL}/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			localStorage.removeItem("token");
			return error.message;
		}

		localStorage.removeItem("token");
	}
}

export default Auth;
