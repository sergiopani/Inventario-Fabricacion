//const { getProduct } = require("../../../controllers/product");

//import axios from "axios";

new Vue({
  el: "#app",
  data: {
    //Array de articulos que parseamos desde el fichero json
    //articulos: [],
    toProduce: [],
    //Array del fetch de json de empresas
    facturas: [],

    //Objeto que guarda la empresa que esta selecionada en el select
    selectedFactura: {
      id: "",
      nomfiscli: "",
      serie: "",
      tipo: "",
      centro: "",
      numero: "",
    },
    articulos: [],

    selectedArticulo: {
      centro: "",
      tipo: 0,
      serie: "",
      numero: 0,
      codiart: "",
      cantidad: 0,
      denoart: "",
      fondo: "",
      lateral: "",
      tapa: "",
    },
    articuloEnviar: {
      centro: "",
      tipo: 0,
      serie: "",
      numero: 0,

      tipoEnviar: "",
      valor: false,
    },
  },
  /*Metodos que se ejecutan al iniciar la pagina*/
  created() {
    const getfacturasExecution = new Promise((resolve, reject) => {
      resolve(this.getFacturas());
    });
    console.log("Las facturas cargadas son " + this.facturas);
    getfacturasExecution.then((value) => {
      this.setDefault(this.facturas[0]);
    });
  },
  methods: {
    comprobarVerde: function (articulo) {
      //enviar objecto de post
      if (
        articulo.fondo === "S" &&
        articulo.lateral === "S" &&
        articulo.tapa === "S"
      ) {
        return true;
      } else if (
        articulo.fondo === "" &&
        articulo.lateral === "" &&
        articulo.tapa === "S"
      ) {
        return true;
      } else if (
        articulo.fondo === "S" &&
        articulo.lateral === "" &&
        articulo.tapa === ""
      ) {
        return true;
      } else if (
        articulo.fondo === "" &&
        articulo.lateral === "S" &&
        articulo.tapa === ""
      ) {
        return true;
      } else if (
        articulo.fondo === "S" &&
        articulo.lateral === "" &&
        articulo.tapa === "S"
      ) {
        return true;
      } else if (
        articulo.fondo === "" &&
        articulo.lateral === "S" &&
        articulo.tapa === "S"
      ) {
        return true;
      } else if (
        articulo.fondo === "S" &&
        articulo.lateral === "S" &&
        articulo.tapa === ""
      ) {
        return true;
      }
      /*else {
                this.deleteProduct(articulo);
            }*/
    },
    sendProduction: function (articulo) {
      //Comprueba que elementos li estan marcados en verde
      this.toProduce.push(articulo);
    },
    deleteProduct: function (articulo) {
      console.log("Deleteando el articulo" + articulo);
      for (let i = 0; i < this.toProduce.length; i++) {
        if (this.toProduce[i] === articulo) {
          this.toProduce[i] = null;
        }
      }
      this.deleteNullsFromArray();

      console.log("Las que se envian a producir son: " + this.toProduce);
    },
    deleteNullsFromArray: function () {
      //Eliminar las posiciones que son nulas
      this.toProduce = this.toProduce.filter((element) => {
        return element !== null;
      });
    },
    showProduction: function () {
      //Eliminar las posiciones que son nulas
      /*
            const results = this.toProduce.filter(element => {
                return element !== null;
            });
            */
      console.log(this.toProduce);
      this.postProduction(this.toProduce);
    },
    postProduction: async function (toProduceArray) {
      //Refrescar la lista de productos
      this.refreshProducts();
      //Envia a PEP todas los objectos que van a producion
      const url = "http://localhost:8080/kriterOMNI/KriterRS004/closeOP";
      try {
        await axios.post(url, toProduceArray).then((data) => {
          console.log(data);
        });
      } catch (error) {
        console.log(error.response);
      }
    },
    filter: function (a) {
      /*console.log(a.serie + " "+ a.tipo + " " + a.centro + " es igual a ->" + this.currentEmpresa.serie + " " + this.currentEmpresa.tipo + " " + this.currentEmpresa.centro)
            console.log()*/

      let ideProducto = a.centro + a.tipo + a.serie + a.numero;

      return (
        ideProducto.toUpperCase() === this.selectedFactura.id.toUpperCase()
      );
    },
    setSelected: function (facturaObject) {
      //console.log("cambiando  ->" + facturaId)
      //Sacamos una array separando por '/' en cada uno de las posiciones
      //let atributos = this.currentFactura.id.split('/');
      //console.log(atributos);
      //Recorrer la array
      this.setDefault(facturaObject);
    },
    setDefault: function (factura) {
      /*this.selectedFactura.id = factura.serie + factura.tipo + factura.centro + factura.numero;
            this.selectedFactura.nombre = factura.nomfiscli;
            this.selectedFactura.serie = factura.serie;
            this.selectedFactura.tipo = factura.tipo;
            this.selectedFactura.centro = factura.centro;
            this.selectedFactura.numero = factura.numero;*/

      this.selectedFactura = factura;

      this.selectedFactura.id =
        this.selectedFactura.centro +
        this.selectedFactura.tipo +
        this.selectedFactura.serie +
        this.selectedFactura.numero;

      const getfacturasExecution = new Promise((resolve, reject) => {
        resolve(this.getProducts());
      });

      getfacturasExecution.then((value) => {
        this.toProductionDefault();
      });
    },
    toProductionDefault: function () {
      console.log(this.articulos);

      this.articulos.forEach((articulo) => {
        console.log(articulo);
        if (this.comprobarVerde(articulo) === true) {
          this.toProduce.push(articulo);
        }
      });
    },
    refreshProducts: function () {
      this.getProducts();
    },
    beforePost: function (articulo, tipo) {
      //Vamos a poner en el selected articulo actual los valores de de cada uno de los tipos...

      this.selectedArticulo = articulo;
      if (tipo === "fondo") {
        if (event.target.checked === true) {
          this.selectedArticulo.fondo = "S";
        } else {
          this.selectedArticulo.fondo = "X";
        }
      }
      if (tipo === "lateral") {
        if (event.target.checked === true) {
          this.selectedArticulo.lateral = "S";
        } else {
          this.selectedArticulo.lateral = "X";
        }
      }
      if (tipo === "tapa") {
        if (event.target.checked === true) {
          this.selectedArticulo.tapa = "S";
        } else {
          this.selectedArticulo.tapa = "X";
        }
      }
      console.log(this.selectedArticulo);
      //this.comprobarVerde(this.selectedArticulo);
      console.log("**********************");
      if (this.comprobarVerde(this.selectedArticulo) === true) {
        this.sendProduction(this.selectedArticulo);
      } else {
        this.deleteProduct(this.selectedArticulo);
      }
      console.log(event.target.checked);
      this.articuloEnviar.centro = articulo.centro;
      this.articuloEnviar.serie = articulo.serie;
      this.articuloEnviar.tipo = articulo.tipo;
      this.articuloEnviar.numero = articulo.numero;
      this.articuloEnviar.tipoEnviar = tipo;
      this.articuloEnviar.valor = event.target.checked;
      //console.log(this.articuloEnviar);
      console.log("************************");

      this.postProduct();
    },
    postProduct: async function () {
      //Hay que pasar el estado en que se encuentra el check

      const url = "http://localhost:8080/kriterOMNI/KriterRS004/marcarFase";
      try {
        await axios.post(url, this.articuloEnviar).then((data) => {
          console.log(data);
        });
      } catch (error) {
        console.log(error.response);
      }
    },
    //closeOP
    getProducts: async function () {
      try {
        //const url = "http://localhost:8080/kriterOMNI/KriterRS004/getOP?centro=" + this.selectedFactura.centro + "&tipo=" + this.selectedFactura.tipo
        //+"&serie=" + this.selectedFactura.serie + "&numero=" + this.selectedFactura.numero;

        const url = "../data/products.json";

        const response = await axios(url);
        const res = response.data;
        this.articulos = [];
        this.articulos = res;
      } catch (err) {
        console.log(err);
      }
    },

    /*
            getProducts:async function() {
                fetch("../data/products.json")
                    .then((res) => res.json())
                    .then((data) => ((this.selectedFactura.articulos = data)
                        ))
                    .catch((err) => console.log(err.message));
            },
        */

    getFacturas: async function () {
      try {
        //const url = "http://localhost:8080/kriterOMNI/KriterRS004/getOrders";

        const url = "../data/facturas.json";
        const response = await axios(url);

        const res = response.data;
        this.facturas = res;
      } catch (err) {
        console.log(err);
      }
    },

    /*
                getFacturas:async function() {
                    fetch("https://40ac-45-15-136-50.eu.ngrok.io/kriterOMNI/KriterRS004/getOrders")
                        .then((res) => res.json())
                        .then((data) => ((this.facturas = data), console.log(this.facturas)))
                        .catch((err) => console.log(err.message));
                },
        */
  },
});
