getPlayers();

function getPlayers(){
	fetch(`https://www.balldontlie.io/api/v1/players`)
	.then(res => res.json())
	.then(res => {
		for(let elem in res.data){
			let team = res.data[elem].team;
			$("#table_jugadores tbody").append(`
				<tr>
					<th scope="row">${(Number(elem)+1)}</th>
					<td>${res.data[elem].first_name} ${res.data[elem].last_name}</td>
					<td>${team.full_name} (${team.abbreviation})</td>
					<td>${res.data[elem].position}</td>
					<td>
						<button type="button" class="btn btn-primary btn-sm viewPlayer" data-toggle="modal" data-target="#viewPlayer" data-id="${res.data[elem].id}">Ver</button>
					</td>
				</tr>
			`);
		};

		$(".viewPlayer").click(function(){
			let id = $(this).data("id");
			viewPlayer(id);
		});
		$('#table_jugadores').DataTable();
	})
}

function viewPlayer(id){
	let modal = $("#viewPlayer");
	let title = modal.find(".modal-title").empty();
	let content = modal.find(".modal-body").empty();

	fetch(`https://www.balldontlie.io/api/v1/players/${id}`)
	.then(res => res.json())
	.then(res => {
		let team = res.team;
		// console.log(res);
		// console.log(team);
		let posicion = ``;
		if (res.position) posicion = `(${res.position})`;
		title.text(`${res.first_name} ${res.last_name} ${posicion}`);
		content.append(`
			<div class="alert alert-secondary" role="alert"><h5 class="text-center">${team.full_name}</h5></div>
			<p>
				<strong>${team.name} (${team.abbreviation})</strong><br />
				<small>${team.city}</small>
			</p>
			<p>
				Conferencia: <strong>${team.conference}</strong><br />
				División: <strong>${team.division}</strong><br />
			</p>

			<div class="form-group">
				<label for="first_name">First_name</label>
				<input type="text" class="form-control" id="first_name" value="${res.first_name}">
			</div>
			<div class="form-group">
				<label for="last_name">Last_name</label>
				<input type="text" class="form-control" id="last_name" value="${res.last_name}">
			</div>
			<div class="form-group">
				<label for="position">position</label>
				<input type="text" class="form-control" id="position" maxlength="1" value="${res.position}">
			</div>
		`);

		$(".btn_savePlayer").click(function(){
			res.first_name = $("#first_name").val();
			res.last_name = $("#last_name").val();
			res.position = $("#position").val();
			let blob = new Blob([JSON.stringify(res)],
				{type: "text/plain;charset=utf-8"}
			);
			saveAs(blob, `fileTest.txt`);
		});

	})
}