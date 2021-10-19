function init() {
	d3.json("data/data.json")
		.then((data) => {

		})
		.catch((error) => {
			console.log(error);
		});
}