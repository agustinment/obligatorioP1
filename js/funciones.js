// Agustín Méndez - 351999
window.addEventListener("load", inicio);

// ================
// =  GLOBAL VAR  =
// ================
let sistema = new Sistema();

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

    actualizarNroVenta();

    let agregarVentaBtn = document.getElementById("agregarVentaBtn");
    let cerrarVentaBtn = document.getElementById("cerrarVentaBtn");
    agregarVentaBtn.addEventListener("click", () =>{
        if(sistema.influencers.length < 1 || sistema.articulos.length < 1){
            alert("No se puede agregar ventas sin influencers o artículos.");
            return;
        }
        mostrarDialog("agregarVenta");
    });
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
                option.value = sistema.influencers[i].mail;
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

function actualizarNroVenta() {
    let nroVenta = document.getElementById("nroVenta");
    nroVenta.innerHTML = sistema.ventas.length + 1;
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
    for(let i = 0; i < sistema.ventas.length; i++){
        let venta = sistema.ventas[i];
        let tr = document.createElement("tr");

        let tdCodigo = document.createElement("td");
        tdCodigo.innerHTML = i + 1;

        let tdArticulo = document.createElement("td");
        tdArticulo.innerHTML = venta.articulo;
        
        let tdInfluencer = document.createElement("td");
        let influencerObj = sistema.influencers.find(inf => inf.mail == venta.influencerMail)
        tdInfluencer.innerHTML = influencerObj.nombre;
        
        let tdCantidad = document.createElement("td");
        tdCantidad.innerHTML = venta.cantidad;
        
        let tdMedio = document.createElement("td");
        tdMedio.innerHTML = venta.medio;
        
        let tdAccion = document.createElement("td");
        let boton = document.createElement("button");
        boton.innerHTML = "❌";
        boton.classList.add("action");
        boton.addEventListener("click", () => { 
            if(confirm("¿Seguro que querés eliminar la venta?")){ 
                sistema.eliminarVenta(venta.codigo);
            }
        })
        
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
    botonOrden.addEventListener("click", () => {
        influencerOrdenadoAsc = !influencerOrdenadoAsc;
        sistema.ordenarInfluencers();
        renderizarTablaInfluencers();
    });

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
    botonOrden.addEventListener("click", () =>{
        articuloOrdenadoAsc = !articuloOrdenadoAsc;
        sistema.ordenarArticulos();
        renderizarTablaArticulos();
    });

}

function renderizarGrafico(){
    let instagram = 0;
    let youtube = 0;
    let x = 0;
    let tiktok = 0;
    let facebook = 0;
    let otras = 0;
    let totalGeneral = 0;
    
    for(let venta of sistema.ventas){
        let articulo = sistema.articulos.find(art => art.codigo == venta.articulo);
        switch (venta.medio){
            case "instagram":
                instagram += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
            case "youtube":
                youtube += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
            case "x":
                x += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
            case "tiktok":
                tiktok += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
            case "facebook":
                facebook += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
            case "otras":
                otras += (parseInt(venta.cantidad) * parseInt(articulo.precio));
                break;
        }
    }

    totalGeneral = instagram + youtube + x + tiktok + facebook + otras;

    sistema.actualizarBurbuja("burbujaInstagram", instagram, totalGeneral);
    sistema.actualizarBurbuja("burbujaYouTube", youtube, totalGeneral);
    sistema.actualizarBurbuja("burbujaX", x, totalGeneral);
    sistema.actualizarBurbuja("burbujaTikTok", tiktok, totalGeneral);
    sistema.actualizarBurbuja("burbujaFacebook", facebook, totalGeneral);
    sistema.actualizarBurbuja("burbujaOtras", otras, totalGeneral);
}