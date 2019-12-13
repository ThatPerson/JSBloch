
		
		mag_diag = document.getElementById('diagram');
		spin_diag = document.getElementById('spin');
		var mag_data = [{
			x: [],
			y: [],
			name:'Mx'},
			{
			x: [],
			y: [],
			name:'My' },
			{
			x: [],
			y: [],
			name:'Mz' }];
		var layout = {
			xaxis: {autorange: true},
			yaxis: {autorange: true}
		};
		Plotly.plot(mag_diag, mag_data, layout);
		
		var x = [1, 2, 3];
		var y = [1, 2, 3];
		var z = [1, 2, 3];
		var c = [1, 2, 3];
		data_3d = [{
			type: 'scatter3d',
			mode: 'lines',	
			x: [],
			y: [],
			z: [],
			opacity: 1,
			line: {
				width: 6,
				color: [],
				reversescale: false
			}
		}];
		layout_3d = {height: 640};
		Plotly.plot(spin_diag, data_3d, layout_3d);

		
		/*data = [{
			x: [1, 2, 3, 4, 5],
			y: [1, 4, 9, 16, 25] }];*/
		
		/*layout.xaxis.autorange = true;
		layout.yaxis.autorange = true;
		Plotly.react(mag_diag, mag_data, layout);*/

	
		reactor = new System([0, 0, 50], [0, 0, 1], [{"gamma":1, "T1":0.1, "T2":0.1}])
		// dt, B, M, spins

		var dt = 0.0001;
		var spin_sys = document.getElementById("spin_sys");
		var contents = document.getElementById("contents2");
		function populate_lists() {
			while (spin_sys.firstChild) {
				spin_sys.removeChild(spin_sys.firstChild);
			}
			ere = reactor.spins;
			var i;
			for (i = 0; i < ere.length; i++) {
				/* There are definitely cleaner ways of doing this (such as looping over keys). */
				var node = document.createElement("TR");
				var er_id = document.createElement("TH");
				var er_gamma = document.createElement("TD");
				var er_T1 = document.createElement("TD");
				var er_T2 = document.createElement("TD");
				var er_cont = document.createElement("TD");
				er_id.appendChild(document.createTextNode(i));
				er_gamma.appendChild(document.createTextNode(ere[i].gamma));
				er_T1.appendChild(document.createTextNode(ere[i].T1));
				er_T2.appendChild(document.createTextNode(ere[i].T2));
				er_cont.innerHTML = "<a href='javascript:remove_spin("+i+")'>(delete)</a>";
				node.appendChild(er_id);
				node.appendChild(er_gamma);
				node.appendChild(er_T1);
				node.appendChild(er_T2);
				node.appendChild(er_cont);
				spin_sys.appendChild(node);
			}
			
			
		}
		function remove_spin(i) {
			reactor.spins.splice(i, 1);
			reactor.spins_m.splice(i, 1);
			populate_lists();
		}
		/*function remove_contents(izd) {
			console.log(izd);
			delete reactor.initial_contents[izd]
			reactor.reset();
			populate_lists();
		}*/

		var gamma = document.getElementById("gamma");
		var T1 = document.getElementById("T1");
		var T2 = document.getElementById("T2");
		var add = document.getElementById("add");
		
		/* <th><input class="form-control" style="width:100%" type="number" placeholder="Gamma" id="gamma"></th>
							<th><input class="form-control" style="width:100%" type="number" placeholder="T1" id="T1"></th>
							<th><input class="form-control" style="width:100%" type="number" placeholder="T2" id="T2"></th>
							<th><button class="btn btn-default" style="width:100%" type="button" id="add">Add Spin</button></th>*/
		
		add.onclick = function() {
			reactor.spins.push({"gamma": parseFloat(gamma.value), "T1": parseFloat(T1.value), "T2": parseFloat(T2.value)})	
			reactor.spins_m.push(reactor.init_M)			
			populate_lists();
		}

	
		populate_lists();
		var t = 0;
		function update() {
			[Mx, My, Mz] = reactor.run(dt);
			t = t + dt;

			mag_data[0].x.push(t);
			mag_data[0].y.push(Mx);
			mag_data[1].x.push(t);
			mag_data[1].y.push(My);
			mag_data[2].x.push(t);
			mag_data[2].y.push(Mz);
			Plotly.update(mag_diag, mag_data, layout);
			
			data_3d[0].x.push(Mx);
			data_3d[0].y.push(My);
			data_3d[0].z.push(Mz);
			data_3d[0].line.color.push(t);
			Plotly.update(spin_diag, data_3d, layout_3d);
			/*[V, I] = reactor.run(dt);

			chart.data.datasets[0].data.push({x: V, y: I});
			chart.update();
			reactor.diffuse(dt);*/
		}
		
		var bx_slider = document.getElementById("bxs");
		var by_slider = document.getElementById("bys");
		var bz_slider = document.getElementById("bzs");
		var bx_value = document.getElementById("bx");
		var by_value = document.getElementById("by");
		var bz_value = document.getElementById("bz");
		var reset = document.getElementById("reset");
		var start = document.getElementById("start");
		var stop = document.getElementById("stop");

			reset.onclick = function() {

				mag_data[0].x = [];
				mag_data[0].y = [];
				mag_data[1].x = [];
				mag_data[1].y = [];
				mag_data[2].x = [];
				mag_data[2].y = [];
				data_3d[0].x = [];
				data_3d[0].y = [];
				data_3d[0].z = [];
				data_3d[0].line.color = [];
				reactor.reset();
				t = 0;
			}
			start.onclick = function() {
				cv = setInterval(update, 3);
			}
			stop.onclick = function() {
				clearInterval(cv);
			}
			bx_slider.oninput = function() {
				reactor.B[0] = this.value;
				bx_value.innerHTML = this.value;
				//output.innerHTML = this.value;
			} 
			by_slider.oninput = function() {
				reactor.B[1] = this.value;
				by_value.innerHTML = this.value;
			} 
			bz_slider.oninput = function() {
				reactor.B[2] = this.value;
				bz_value.innerHTML = this.value;
			} 
			