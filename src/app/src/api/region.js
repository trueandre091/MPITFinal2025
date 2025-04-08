const BASE_URL = "/api/regions";

class Region {
	async getRegions() {
		const token = localStorage.getItem("token");
		let response;
		try {
			response = await fetch(`${BASE_URL}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.log(error);
			return error.message;
		}

		if (response.status === 401) {
			localStorage.removeItem("token");
			return "Время сессии истекло или неверный токен";
		}

		return response;
	}

	async getRegion(id) {
		const token = localStorage.getItem("token");
		let response;
		try {
			response = await fetch(`${BASE_URL}/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.log(error);
			return error.message;
		}

		if (response.status === 401) {
			localStorage.removeItem("token");
			return "Время сессии истекло или неверный токен";
		}

		return response;
	}
}

export default Region;
