import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";

Vue.component("loader", {
  template: `
    <div style="display: flex;justify-content: center;align-items: center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
});

new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      form: {
        bank_name: "",
        interest_rate: "",
        maximum_loan: "",
        minimum_down_payment: "",
        loan_term: ""
      },
      banks: [],
      selected: "",
      initial_loan_value: "",
      down_payment: Number
    };
  },
  computed: {
    canCreate() {
      return (
        this.form.bank_name.trim() &&
        this.form.interest_rate.trim() &&
        this.form.maximum_loan.trim() &&
        this.form.minimum_down_payment.trim() &&
        this.form.loan_term.trim()
      );
    }
  },
  methods: {
    async createBank() {
      const { ...bank } = this.form;

      const newBank = await request("/api/banks", "POST", bank);

      this.banks.push(newBank);

      this.form.bank_name = this.form.interest_rate = this.form.maximum_loan = this.form.minimum_down_payment = this.form.loan_term =
        "";
    },

    async removeBank(id) {
      await request(`/api/banks/${id}`, "DELETE");
      this.banks = this.banks.filter((c) => c.id !== id);
    }
  },
  async mounted() {
    this.loading = true;
    this.banks = await request("/api/banks");
    this.loading = false;
  }
});

async function request(url, method = "GET", data = null) {
  try {
    const headers = {};
    let body;

    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    });
    return await response.json();
  } catch (e) {
    console.warn("Error:", e.message);
  }
}
