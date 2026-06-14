// Agustín Méndez - 351999
window.addEventListener("load", inicio);

class Sistema {
    constructor(){
        this.influencers = [];
        this.articulos = [];
        this.ventas = [];
    }

    // ===========
    // = AGREGAR =
    // ===========

    agregarInfluencer(nombre, mail, comision){
        let nuevoInfluencer = new Influencer(nombre, mail, comision);
        this.influencers.push(nuevoInfluencer);
        return nuevoInfluencer;
    }

    agregarNuevoInfluencer(){
        let nombre = document.getElementById("name");
        let email = document.getElementById("email");
        let comision = document.getElementById("comision");
        if(nombre.value != "" && email.value != "" && comision.value != ""){
            this.agregarInfluencer(nombre.value, email.value, comision.value);
            renderizarTablaInfluencers();
            nombre.value = "";
            email.value = "";
            comision.value = "";
        
            actualizarSelect("influencer");
        }
    }

    agregarArticulo(codigo, desc, precio){ 
        let nuevoArticulo = new Articulo(codigo, desc, precio);
        this.articulos.push(nuevoArticulo);
        return nuevoArticulo;
    }

    agregarNuevoArticulo(){
        let codigo = document.getElementById("codigo");
        let desc = document.getElementById("desc");
        let precio = document.getElementById("precio");
        if(codigo.value != "" && desc.value != "" && precio.value != ""){
            this.agregarArticulo(codigo.value, desc.value, precio.value);
            renderizarTablaArticulos();
            codigo.value = "";
            desc.value = "";
            precio.value = "";
            
            actualizarSelect("articulo");
        }
    }


    agregarVenta(articulo, influencer, cantidad, medio){
        let codigo = this.ventas.length + 1;
        let nuevaVenta = new Venta(articulo, influencer, cantidad, medio);
        nuevaVenta.codigo = codigo;
        this.ventas.push(nuevaVenta);
        let influencerObj = this.influencers.find(inf => inf.nombre == influencer)
        influencerObj.ventas.push(nuevaVenta);
        return nuevaVenta;
    }

    agregarNuevaVenta(){
        let articulo = document.getElementById("articulo");
        let influencer = document.getElementById("influencer");
        let cantidad = document.getElementById("cantidad");
        let medio = document.getElementById("medio");
        if(articulo.value != "" && influencer.value != "" && cantidad.value != "" && medio.value != ""){
            let venta = this.agregarVenta(articulo.value, influencer.value, cantidad.value, medio.value);
            renderizarTablaVentas();
            renderizarTablaInfluencers();
            renderizarTablaArticulos();
            cantidad.value = "";
        }
    }


    // ===========
    // = GESTION =
    // ===========

    influencerMayorVenta(){
        let maxVenta = Number.MIN_SAFE_INTEGER;
        let maxInfluencer = "";

        for(let venta of this.ventas){
            let articulo = this.articulos.find(art => art.codigo == venta.articulo);
            let monto = articulo.precio * venta.cantidad;
            if(monto > maxVenta){
                maxVenta = monto;
                maxInfluencer = venta.influencer;
            } 
        }

        return maxInfluencer
    }

    influencerMayorComision(){
        let maxCom = Number.MIN_SAFE_INTEGER;
        let maxInfluencer = "";

        for(let influencer of this.influencers){
            if(parseInt(influencer.comision) > maxCom){
                maxCom = influencer.comision;
                maxInfluencer = influencer.nombre;
            }
        }

        return maxInfluencer;
    }

    articuloMasVendido(){
        let maxCant = Number.MIN_SAFE_INTEGER;
        let maxArticulo = "";

        for(let articulo of this.articulos){
            let cantidad = 0;
            for(let venta of this.ventas){
                if(venta.articulo == articulo.codigo){
                    cantidad += parseInt(venta.cantidad);
                }
            }
            if(cantidad > maxCant){
                maxCant = cantidad;
                maxArticulo = articulo.codigo;
            }
        }

        return maxArticulo;
    }

    mostrarVentasInfluencer(influencer){
        if(influencer.ventas.length == 0){
            alert(influencer.nombre + " no tiene ventas.");
            return;
        }
        
        let mensaje = "Ventas:\n"

        for(let venta of influencer.ventas) {
            let articulo = this.articulos.find(art => art.codigo == venta.articulo)
            let total = articulo.precio * venta.cantidad;
            let comision = total * (influencer.comision / 100);
            mensaje += "-> " + venta.cantidad + "-> " + venta.articulo + " -> $" + articulo.precio + "c/u total: $" + total + "-> comision: " + comision + "\n";
        }

        alert(mensaje);
    }

    ordenarInfluencers() {
        if (influencerOrdenadoAsc) {
            this.influencers.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else {
            this.influencers.sort((a, b) => b.nombre.localeCompare(a.nombre));
        }

        influencerOrdenadoAsc = !influencerOrdenadoAsc;
        renderizarTablaInfluencers();
    }

    ordenarArticulos() {
        if(articuloOrdenadoAsc){
            this.articulos.sort((a, b) => a.codigo.localeCompare(b.codigo));
        } else {
            this.articulos.sort((a, b) => b.codigo.localeCompare(a.codigo));
        }

        articuloOrdenadoAsc = !articuloOrdenadoAsc;
        renderizarTablaArticulos();
    }

    eliminarVenta(nro) {
        this.ventas = this.ventas.filter(vent => vent.codigo != nro);
        console.log(this.ventas);
        renderizarTablaInfluencers();
    }

}

class Influencer {
    constructor(nombre, mail, comision){
        this.nombre = nombre;
        this.mail = mail;
        this.comision = comision;
        this.ventas = [];
    }

    establecerTotal(){
        let total = 0;
        for(let venta of this.ventas){
            let articulo = sistema.articulos.find(art => art.codigo == venta.articulo);
            total += parseInt(articulo.precio) * parseInt(venta.cantidad);
        }
        return (total * (parseInt(this.comision) / 100));
    }


    establecerEtiquetas(){
        let etiquetas = "";

        if(this.ventas.length == 0){
            etiquetas += "🧊";
        }
        if(this.nombre == sistema.influencerMayorComision()){
            etiquetas += "🔥";
        }
        if(this.nombre == sistema.influencerMayorVenta()){
            etiquetas += "🟢";
        }

        return etiquetas;
    }


}

class Articulo {
    constructor(codigo, desc, precio){
        this.codigo = codigo;
        this.desc = desc;
        this.precio = precio;
    }
}

class Venta {
    constructor(articulo, influencer, cantidad, medio){
        this.codigo = 0;
        this.articulo = articulo;
        this.influencer = influencer;
        this.cantidad = cantidad;
        this.medio = medio;
    }
}

// ================
// =  GLOBAL VAR  =
// ================
let sistema = new Sistema();
let influencerOrdenadoAsc = false;
let articuloOrdenadoAsc = false;

function inicio(){
    
    // =================
    // =  INFLUENCERS  =
    // =================

    let influencerForm = document.getElementById("influencerForm");
    influencerForm.addEventListener("submit", event => event.preventDefault());

    let agregarInfluencerBtn = document.getElementById("agregarInfluencerBtn");
    let cerrarInfluncerBtn = document.getElementById("cerrarInfluencerBtn");
    agregarInfluencerBtn.addEventListener("click", () => mostrarDialog("agregarInfluencer"));
    cerrarInfluncerBtn.addEventListener("click", () => cerrarDialog("agregarInfluencer"));

    let confirmarInfluencerBtn = document.getElementById("confirmarInfluencerBtn");
    confirmarInfluencerBtn.addEventListener("click", () => sistema.agregarNuevoInfluencer());

    // ===============
    // =  ARTICULOS  =
    // ===============

    let articuloForm = document.getElementById("articuloForm");
    articuloForm.addEventListener("submit", event => event.preventDefault());

    let agregarArticuloBtn = document.getElementById("agregarArticuloBtn");
    let cerrarArticuloBtn = document.getElementById("cerrarArticuloBtn");
    agregarArticuloBtn.addEventListener("click", () => mostrarDialog("agregarArticulo"));
    cerrarArticuloBtn.addEventListener("click", () => cerrarDialog("agregarArticulo"))

    let confirmarArticuloBtn = document.getElementById("confirmarArticuloBtn");
    confirmarArticuloBtn.addEventListener("click", () => sistema.agregarNuevoArticulo())

    // ============
    // =  VENTAS  =
    // ============

    let ventaForm = document.getElementById("ventaForm");
    ventaForm.addEventListener("submit", event => event.preventDefault());


    let agregarVentaBtn = document.getElementById("agregarVentaBtn");
    let cerrarVentaBtn = document.getElementById("cerrarVentaBtn");
    agregarVentaBtn.addEventListener("click", () => mostrarDialog("agregarVenta"));
    cerrarVentaBtn.addEventListener("click", () => cerrarDialog("agregarVenta"));
    
    let confirmarVentaBtn = document.getElementById("confirmarVentaBtn");
    confirmarVentaBtn.addEventListener("click", () => sistema.agregarNuevaVenta())

}


function mostrarDialog(id) {
    let dialog = document.getElementById(id);
    dialog.showModal();
}

function cerrarDialog(id){
    let dialog = document.getElementById(id);
    dialog.close();
}

function actualizarSelect(id){
    let select = document.getElementById(id);
    select.innerHTML = "";
    switch (id) {
        case "influencer":
            for(let i=0; i<sistema.influencers.length; i++){
                let option = document.createElement("option");
                option.value = sistema.influencers[i].nombre;
                option.innerHTML = sistema.influencers[i].nombre;
                select.appendChild(option);
            };
            break;
        case "articulo":
            for(let i=0; i<sistema.articulos.length; i++){
                let option = document.createElement("option");
                option.value = sistema.articulos[i].codigo;
                option.innerHTML = sistema.articulos[i].codigo;
                select.appendChild(option);
            };
            break;
    }
}


// ==========
// = TABLAS =
// ==========

function renderizarTablaVentas(){
    let tabla = document.getElementById("tablaVentas");
    tabla.innerHTML = `
                    <tr>
                        <th>Nro Venta</th>
                        <th>Código de Artículo</th>
                        <th>Nombre de Influencer</th>
                        <th>Cantidad</th>
                        <th>Medio</th>
                        <th>Acción</th>
                    </tr>`
    for(let venta of sistema.ventas){
        let tr = document.createElement("tr");

        let tdCodigo = document.createElement("td");
        tdCodigo.innerHTML = venta.codigo;

        let tdArticulo = document.createElement("td");
        tdArticulo.innerHTML = venta.articulo;
        
        let tdInfluencer = document.createElement("td");
        tdInfluencer.innerHTML = venta.influencer;
        
        let tdCantidad = document.createElement("td");
        tdCantidad.innerHTML = venta.cantidad;
        
        let tdMedio = document.createElement("td");
        tdMedio.innerHTML = venta.medio;
        
        let tdAccion = document.createElement("td");
        let boton = document.createElement("button");
        boton.innerHTML = "❌";
        boton.classList.add("action");
        boton.addEventListener("click", () => sistema.eliminarVenta(venta.codigo))
        
        tdAccion.appendChild(boton);
        
        tr.appendChild(tdCodigo);
        tr.appendChild(tdArticulo);
        tr.appendChild(tdInfluencer);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdMedio);
        tr.appendChild(tdAccion);

        tabla.appendChild(tr);

    }
}

function renderizarTablaInfluencers() {
    let tabla = document.getElementById("tablaInfluencers");
    tabla.innerHTML = `
        <tr>
            <th><button class="nombre" id="ordenarInfluencersBtn">Nombre ⇅</button></th>
            <th>Email</th>
            <th>% Comisión</th>
            <th>Total a cobrar</th>
            <th>Etiquetas</th>
            <th>Detalle</th>
        </tr>`;
    
    for(let influencer of sistema.influencers){
        let tr = document.createElement("tr");

        let tdNombre = document.createElement("td");
        tdNombre.innerHTML = influencer.nombre;

        let tdMail = document.createElement("td");
        tdMail.innerHTML = influencer.mail;
        
        let tdComision = document.createElement("td");
        tdComision.innerHTML = influencer.comision + "%";
        
        let tdTotal = document.createElement("td");
        tdTotal.innerHTML = "$ " + influencer.establecerTotal();
        
        let tdEtiquetas = document.createElement("td");
        tdEtiquetas.innerHTML = influencer.establecerEtiquetas();
        
        let tdDetalle = document.createElement("td");
        let boton = document.createElement("button");
        boton.innerHTML = "Ventas";
        boton.classList.add("ventasBtn")
        boton.addEventListener("click", () => sistema.mostrarVentasInfluencer(influencer));
        tdDetalle.appendChild(boton);

        tr.appendChild(tdNombre);
        tr.appendChild(tdMail);
        tr.appendChild(tdComision);
        tr.appendChild(tdTotal);
        tr.appendChild(tdEtiquetas);
        tr.appendChild(tdDetalle);

        tabla.appendChild(tr);
    }

    let botonOrden = document.getElementById("ordenarInfluencersBtn");
    botonOrden.addEventListener("click", () => sistema.ordenarInfluencers());

}

function renderizarTablaArticulos(){
    let tabla = document.getElementById("tablaArticulos");
    tabla.innerHTML = `
                    <tr>
                        <th><button id="ordenarArticulosBtn">Código ⇅</button></th>
                        <th>Descripción</th>
                        <th>Precio</th>
                    </tr>
    `
    for(let articulo of sistema.articulos){
        let tr = document.createElement("tr");

        let tdCodigo = document.createElement("td");
        if(sistema.ventas.length != 0 && articulo.codigo == sistema.articuloMasVendido()){
            tdCodigo.innerHTML = articulo.codigo + " ⭐";
        } else {
            tdCodigo.innerHTML = articulo.codigo;
        }

        let tdDesc = document.createElement("td");
        tdDesc.innerHTML = articulo.desc;
    
        let tdPrecio = document.createElement("td");
        tdPrecio.innerHTML = articulo.precio;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPrecio);

        tabla.appendChild(tr);
    }

    let botonOrden = document.getElementById("ordenarArticulosBtn");
    botonOrden.addEventListener("click", () => sistema.ordenarArticulos());

}
