
// ================
// =  GLOBAL VAR  =
// ================
let influencerOrdenadoAsc = true;
let articuloOrdenadoAsc = true;

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
        if(!this.mailUnico(email.value)){
            alert("Ese mail ya está en uso");
            email.value = "";
        }
        if(comision.value < 0 || comision.value > 100){
            alert("Ingrese una comisión válida (entre 0 y 100).")
            comision.value = "";
        }
        if(email.value.toLowerCase() != email.value){
            alert("Ingrese un email válido (todo minúsculas).")
            email.value = "";
        }

        if(nombre.value != "" && email.value != "" && comision.value != ""){
            this.agregarInfluencer(nombre.value, email.value, comision.value);
            this.ordenarInfluencers();
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
        if(!this.codigoUnico(codigo.value)){
            alert("El código debe ser único");
            codigo.value = "";
        }
        if(precio.value <= 0 && precio.value != ""){
            alert("El precio debe ser mayor a 0.");
            precio.value = "";
        }

        if(codigo.value != "" && desc.value != "" && precio.value != ""){
            this.agregarArticulo(codigo.value, desc.value, precio.value);
            this.ordenarArticulos();
            renderizarTablaArticulos();
            codigo.value = "";
            desc.value = "";
            precio.value = "";
            
            actualizarSelect("articulo");
        }
    }


    agregarVenta(articulo, influencerMail, cantidad, medio){
        let nuevaVenta = new Venta(articulo, influencerMail, cantidad, medio);
        this.ventas.push(nuevaVenta);
        let influencerObj = this.influencers.find(inf => inf.mail == influencerMail)
        influencerObj.ventas.push(nuevaVenta);
        this.reenumerarVentas();
        actualizarNroVenta();
        return nuevaVenta;
    }

    agregarNuevaVenta(){
        let articulo = document.getElementById("articulo");
        let influencer = document.getElementById("influencer");
        let cantidad = document.getElementById("cantidad");
        let medio = document.getElementById("medio");

        if(cantidad.value != "" && cantidad.value <= 0){
            alert("La cantidad debe ser mayor a 0.");
            cantidad.value = "";
        }

        if(articulo.value != "" && influencer.value != "" && cantidad.value != "" && medio.value != ""){
            let venta = this.agregarVenta(articulo.value, influencer.value, cantidad.value, medio.value);
            renderizarTablaVentas();
            renderizarTablaInfluencers();
            renderizarTablaArticulos();
            renderizarGrafico()
            cantidad.value = "";
        }
    }


    // ===========
    // = GESTION =
    // ===========

    influencerMayorVenta(){
        let maxVenta = Number.MIN_SAFE_INTEGER;
        let maxInfluencerMail = "";

        for(let venta of this.ventas){
            let articulo = this.articulos.find(art => art.codigo == venta.articulo);
            let monto = articulo.precio * venta.cantidad;
            if(monto > maxVenta){
                maxVenta = monto;
                maxInfluencerMail = venta.influencerMail;
            } 
        }

        return maxInfluencerMail
    }

    influencerMayorComision(){
        let maxCom = Number.MIN_SAFE_INTEGER;
        let maxInfluencerMail = "";

        for(let influencer of this.influencers){
            if(parseInt(influencer.comision) > maxCom){
                maxCom = influencer.comision;
                maxInfluencerMail = influencer.mail;
            }
        }

        return maxInfluencerMail;
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
            mensaje += "Nro " + venta.codigo + " -> " + venta.cantidad + " -> " + venta.articulo + " -> $" + articulo.precio + "c/u total: $" + total + "-> comision: " + comision + "\n";
        }

        alert(mensaje);
    }

    ordenarInfluencers() {
        if (influencerOrdenadoAsc) {
            this.influencers.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else {
            this.influencers.sort((a, b) => b.nombre.localeCompare(a.nombre));
        }
    }

    ordenarArticulos() {
        if(articuloOrdenadoAsc){
            this.articulos.sort((a, b) => a.codigo.localeCompare(b.codigo));
        } else {
            this.articulos.sort((a, b) => b.codigo.localeCompare(a.codigo));
        }
    }

    reenumerarVentas(){
        for(let i = 0; i < this.ventas.length; i++){
            this.ventas[i].codigo = i+1;
        }
    }

    eliminarVenta(codigo) {
        this.ventas = this.ventas.filter(venta => venta.codigo != codigo);

        for(let influencer of this.influencers){
            influencer.ventas = influencer.ventas.filter(venta => venta.codigo != codigo);
        }

        this.reenumerarVentas();
        actualizarNroVenta();

        renderizarTablaVentas();
        renderizarTablaArticulos();
        renderizarTablaInfluencers();
        renderizarGrafico();
    }

    actualizarBurbuja(id, valor, totalGeneral){
        let burbuja = document.getElementById(id);
        burbuja.innerHTML = valor;

        let diametro = 0;
        if(totalGeneral == 0){
            diametro = 70;
        } else{
            diametro = 10 + Math.sqrt(valor / totalGeneral) * 80;
        }
        
        burbuja.style.width = diametro + "px";
        burbuja.style.height = diametro + "px";
    }

    // ==============
    // = VALIDACIÓN =
    // ==============

    mailUnico(mail) {
        let esUnico = true;
        for(let influencer of this.influencers){
            if(influencer.mail == mail){
                esUnico = false;
            }
        }
        return esUnico;
    }

    codigoUnico(codigo) {
        let esUnico = true;
        for(let articulo of this.articulos){
            if(articulo.codigo == codigo){
                esUnico = false;
            }
        }
        return esUnico;
    }


    influencerMayorTotal(){
        let mayorTotal = Number.MIN_SAFE_INTEGER;
        let mayorInfluencer = "";
        for(let influencer of this.influencers){
            if(influencer.establecerTotal != 0 && influencer.establecerTotal() > mayorTotal){
                mayorTotal = influencer.establecerTotal();
                mayorInfluencer = influencer.mail;
            }
        }
        if(mayorTotal == 0){
            return false;
        }
        return mayorInfluencer;
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
        if(this.mail == sistema.influencerMayorTotal()){
            etiquetas += "🔥";
        }
        if(this.mail == sistema.influencerMayorVenta()){
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
    constructor(articulo, influencerMail, cantidad, medio){
        this.codigo = 0;
        this.articulo = articulo;
        this.influencerMail = influencerMail;
        this.cantidad = cantidad;
        this.medio = medio;
    }
}
