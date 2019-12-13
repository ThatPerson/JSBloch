/*----------------------------------------------------------------------*
 * File:    cv.js*
 *                                                                      *
 * Purpose: Simulate a cyclicvoltammogram using a basic model.          *
 *                                                                      *
 *                                                                      *
 * Author:  Ben Tatman                                                  *
 *          ben@tatmans.co.uk                                           *
 *                                                                      *
 * License: Copyright 2019 Ben Tatman                              *
 * Permission is hereby granted, free of charge, to any person          *
 * obtaining a copy of this software and associated documentation files *
 * (the "Software"), to deal in the Software without restriction,       *
 * including without limitation the rights to use, copy, modify, merge, *
 * publish, distribute, sublicense, and/or sell copies of the Software, *
 * and to permit persons to whom the Software is furnished to do so,    *
 * subject to the following conditions:                                 *
 *                                                                      *
 * The above copyright notice and this permission notice shall be       *
 * included in all copies or substantial portions of the Software.      *
 *                                                                      *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,      *
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF   *
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND                *
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS  *
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN   *
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN    *
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE     *
 * SOFTWARE.                                                            *
 *                                                                      *
 * History: 16th July 2019, version 0.1                                 *
 *----------------------------------------------------------------------*/

function round_n(x, n) {
	return Math.round(x * 10**n)/(10**n);
}



class System {
	constructor(B, M, spins) {
		this.B = B;
		this.init_M = M;
		this.spins = spins;
		this.spins_m = [];
		var i = 0;
		for (i = 0; i < this.spins.length; i++) {
			this.spins_m.push(this.init_M.slice());
		}
		
	/*new System([0, 0, 50], [0, 1, 0], [{"gamma":1, "T1":3, "T2":3}])*/
	
		this.run(0);
	}

	/*step_e(dt) {
		if (this.c == 1 && this.voltage > this.voltage_lim) {
			this.c = -1;
		} else if (this.c == -1 && this.voltage < -this.voltage_lim) {
			this.c = 1;
		}
		this.voltage += this.c * dt * this.e_step;
	}*/
	reset() {
		var i;

		for (i = 0; i < this.spins.length; i++) {
			this.spins_m[i] = this.init_M.slice();
		}
	}
	run(dt) {
		/*this.step_e(dt);
		var I = this.cells[0].operate_e(this.voltage, this.e_reactions);
		return [this.voltage, I];*/
		var Mx = 0;
		var My = 0;
		var Mz = 0;
		var i = 0;
		for (i = 0; i < this.spins_m.length; i++) {
			var dMx = dt * (this.spins[i].gamma * (this.spins_m[i][1] * this.B[2] - this.spins_m[i][2] * this.B[1]) - (this.spins_m[i][0] / this.spins[i].T2));
			var dMy = dt * (this.spins[i].gamma * (this.spins_m[i][2] * this.B[0] - this.spins_m[i][0] * this.B[2]) - (this.spins_m[i][1] / this.spins[i].T2));
			var dMz = dt * (this.spins[i].gamma * (this.spins_m[i][0] * this.B[1] - this.spins_m[i][1] * this.B[0]) - ((this.spins_m[i][2] - 1) / this.spins[i].T1));
			this.spins_m[i][0] = this.spins_m[i][0] + dMx;
			this.spins_m[i][1] = this.spins_m[i][1] + dMy;
			this.spins_m[i][2] = this.spins_m[i][2] + dMz;
			Mx += this.spins_m[i][0];
			My += this.spins_m[i][1];
			Mz += this.spins_m[i][2];
		/*dMx = dt * (gamma * (My * Bz - Mz * By) - (Mx / T2))
    dMy = dt * (gamma * (Mz * Bx - Mx * Bz) - (My / T2))
    dMz = dt * (gamma * (Mx * By - My * Bx) - ((Mz - M0) / T1))
    
    Mx = Mx + dMx
    My = My + dMy
    Mz = Mz + dMz*/
		}
		return [Mx, My, Mz];
	}
	/*diffuse(dt) {
		var i, p;
		for (i = 0; i < this.cells.length; i++) {
			this.cells[i].push();
		}
		for (i = 0; i < this.cells.length; i++) {
			var l_n = (i - 1 < 0 ? 0 : i - 1);
			var p_n = (i + 1 > this.cells.length - 1 ? this.cells.length -1 : i + 1);
			var keys = Object.keys(this.cells[0].contents);
			for (p = 0; p < keys.length; p++) {

				this.cells[i].contents[keys[p]] = (this.d_coeff * (this.cells[l_n].safe_contents[keys[p]] + this.cells[p_n].safe_contents[keys[p]]));
				this.cells[i].contents[keys[p]] += (1 - 2*this.d_coeff) * this.cells[i].safe_contents[keys[p]];
			}
		}
	}*/
}

if (typeof window === 'undefined') {
	reactor = new Reactor(30, {"ox": 1000, "red": 0}, 5, 1, 0.01, 
	[{"ox": "ox", "red": "red", "pot": 0}]);
	for (i = 0; i < 40; i += 0.01) {
		[V, I] = reactor.run(0.01);
		console.log(round_n(V, 2) + ", " + round_n(I, 2));
		reactor.diffuse(0.01);
	}
}
