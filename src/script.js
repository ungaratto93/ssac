class SAC {
  constructor() {
    this.amount = 0;
    this.fees = 0;
    this.monthlyDeadline = 0;
    this.monthlyFees = 0.0;
    this.aggFees = 0;
    this.debt = 0;
    this.installments = [];
  }

  setMonthlyDeadline(yearDeadline) {
    this.monthlyDeadline = yearDeadline * 12;
  }

  getMonthlyDeadline() {
    return this.monthlyDeadline;
  }

  setFees(fees) {
    this.fees = parseFloat(fees);
  }

  setMonthlyFees() {
    this.monthlyFees = (parseFloat(this.fees) + 1) ** (1 / 12) - 1;
  }

  getMonthlyFees() {
    return this.monthlyFees;
  }

  setAmount(amount) {
    this.amount = parseFloat(amount);
  }

  getArmotized() {
    return this.amortized;
  }

  setAmortized() {
    this.amortized = this.amount / this.monthlyDeadline;
  }

  getAggFees() {
    return this.aggFees;
  }

  setAggFees(currentFee) {
    this.aggFees += currentFee;
  }

  getCurrentFee(installment) {
    return this.amount - installment * this.amortized;
  }

  getDebt() {
    return this.amount + this.amortized;
  }

  setInstallments() {
    var index = 0;
    while (index < this.getMonthlyDeadline()) {
      var installment = {
        amortized: this.getArmotized().toFixed(2),
        fee: (this.getCurrentFee(index) * this.getMonthlyFees()).toFixed(2),
        total: (
          this.getCurrentFee(index) * this.getMonthlyFees() +
          this.getArmotized()
        ).toFixed(2),
      };
      this.installments[index] = installment;
      this.setAggFees(parseFloat(installment.fee));
      index++;
    }
  }
}

class Page {
  static beginSacSimulation(amount, deadline, fees) {
    let sac = new SAC(amount, fees, deadline);
    sac.setAmount(amount);
    sac.setMonthlyDeadline(deadline);
    sac.setFees(fees);
    sac.setMonthlyFees();
    sac.setAmortized();
    sac.setInstallments();
    return sac;
  }

  static renderSimulationResponse(objectSAC) {
    let fieldMonthlyDeadline = document.getElementById("monthlyDeadline");
    fieldMonthlyDeadline.value = objectSAC.getMonthlyDeadline();
    let fieldMonthlyFees = document.getElementById("montlyFees");
    fieldMonthlyFees.value = objectSAC.getMonthlyFees();
    let fieldAggFees = document.getElementById("aggFees");
    fieldAggFees.value = objectSAC.getAggFees().toFixed(2);

    let index = 0;
    let dataTable = document.getElementById("dataTable");
    dataTable.innerHTML = "";
    while (index < 5) {
      dataTable.innerHTML +=
        "<tr><td>" +
        parseInt(index + 1) +
        "</td><td>" +
        objectSAC.installments[index]["amortized"] +
        "</td><td>" +
        objectSAC.installments[index]["fee"] +
        "</td><td>" +
        objectSAC.installments[index]["total"] +
        "</td></tr>";
      index++;
    }
  }

  static toggleElementsVisibility() {
    document.getElementById("simulateButton").disabled = true;
    document.getElementById("report").hidden = false;
  }
}

function toSimulate() {
  let amount = parseFloat(document.getElementById("amount").value);
  let deadline = parseInt(document.getElementById("deadline").value);
  let fees = parseFloat(document.getElementById("fees").value);

  let data = Page.beginSacSimulation(amount, deadline, fees);
  Page.toggleElementsVisibility();
  Page.renderSimulationResponse(data);
}
