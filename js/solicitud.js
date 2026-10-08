/**
 * Esparza's Carpet Cleaning - Solicitud de Servicio & Presupuesto
 * Validaciones en tiempo real, manejo de cantidades y generación estructurada de mensaje a WhatsApp
 */

function changeCount(elementId, delta) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let currentVal = parseInt(el.textContent.trim(), 10) || 0;
  let newVal = Math.max(0, currentVal + delta);
  el.textContent = newVal;
}

function applyPromo3Rooms() {
  const roomsEl = document.getElementById('cnt-rooms');
  const hallwaysEl = document.getElementById('cnt-hallways');
  if (roomsEl) roomsEl.textContent = '3';
  if (hallwaysEl) hallwaysEl.textContent = '1';

  const feedback = document.getElementById('promo-applied-feedback');
  if (feedback) {
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 4500);
  }
}

// Auto-scroll if navigated via hash without pre-adding any items
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

function toggleTileFields(isChecked) {
  const subfields = document.getElementById('tile-subfields');
  if (subfields) {
    subfields.style.display = isChecked ? 'block' : 'none';
  }
}

function checkCityValidation() {
  // Active valley cities
}

function checkZipValidation(zipVal) {
  // Active valley zip codes
}

function handleServiceRequestSubmit(event) {
  event.preventDefault();

  const isEn = (document.documentElement.lang === 'en' || localStorage.getItem('esparzas_lang') === 'en');

  // Validate mandatory terms acceptance checkbox
  const termsCheckbox = document.getElementById('req-terms-checkbox');
  if (termsCheckbox && !termsCheckbox.checked) {
    alert(isEn
      ? "Please check the box to accept the Service Policies and Terms & Conditions before submitting."
      : "Por favor marca la casilla para aceptar las Políticas del Servicio y Términos y Condiciones antes de continuar.");
    termsCheckbox.focus();
    return;
  }

  const name = document.getElementById('req-name').value.trim();
  const phone = document.getElementById('req-phone').value.trim();
  const address = document.getElementById('req-address').value.trim();
  const city = document.getElementById('req-city').value.trim();
  const zip = document.getElementById('req-zip').value.trim();

  // Quantities
  const rooms = parseInt(document.getElementById('cnt-rooms')?.textContent || '0', 10);
  const hallways = parseInt(document.getElementById('cnt-hallways')?.textContent || '0', 10);
  const stairs = parseInt(document.getElementById('cnt-stairs')?.textContent || '0', 10);

  const sofa3 = parseInt(document.getElementById('cnt-sofa3')?.textContent || '0', 10);
  const sofaL = parseInt(document.getElementById('cnt-sofaL')?.textContent || '0', 10);
  const armchair = parseInt(document.getElementById('cnt-armchair')?.textContent || '0', 10);
  const chairs = parseInt(document.getElementById('cnt-chairs')?.textContent || '0', 10);

  const mattressKing = parseInt(document.getElementById('cnt-mattress-king')?.textContent || '0', 10);
  const mattressQueen = parseInt(document.getElementById('cnt-mattress-queen')?.textContent || '0', 10);
  const mattressTwin = parseInt(document.getElementById('cnt-mattress-twin')?.textContent || '0', 10);

  const isTileChecked = document.getElementById('chk-tile')?.checked || false;
  const tileSqft = document.getElementById('req-tile-sqft')?.value.trim() || '';
  const isSealantChecked = document.getElementById('chk-sealant')?.checked || false;

  const cars = parseInt(document.getElementById('cnt-cars')?.textContent || '0', 10);

  const petUrineRooms = parseInt(document.getElementById('cnt-pet-urine')?.textContent || '0', 10);
  const isPetHairChecked = document.getElementById('chk-pet-hair')?.checked || false;

  const defaultDate = isEn ? 'To be coordinated' : 'Por coordinar';
  const defaultTime = isEn ? 'Flexible preferred slot' : 'Turno preferido flexible';
  const prefDate = document.getElementById('req-date')?.value.trim() || defaultDate;
  const prefTime = document.getElementById('req-time-slot')?.value.trim() || defaultTime;
  const notes = document.getElementById('req-notes')?.value.trim() || '';

  // Construct items list
  const requestedItems = [];
  if (isEn) {
    if (rooms > 0) requestedItems.push(`• Carpeted Bedrooms / Rooms: ${rooms} (standard up to 13x15 ft)`);
    if (hallways > 0) requestedItems.push(`• Hallways: ${hallways}`);
    if (stairs > 0) requestedItems.push(`• Flights of Stairs: ${stairs}`);

    if (sofa3 > 0) requestedItems.push(`• Standard 3-Seater Sofa: ${sofa3}`);
    if (sofaL > 0) requestedItems.push(`• 'L' Sectional Couch: ${sofaL}`);
    if (armchair > 0) requestedItems.push(`• Armchair / Recliner: ${armchair}`);
    if (chairs > 0) requestedItems.push(`• Dining Chairs: ${chairs}`);

    if (mattressKing > 0) requestedItems.push(`• King / Cal-King Mattress: ${mattressKing}`);
    if (mattressQueen > 0) requestedItems.push(`• Queen / Full Mattress: ${mattressQueen}`);
    if (mattressTwin > 0) requestedItems.push(`• Twin Mattress: ${mattressTwin}`);

    if (isTileChecked) {
      let tileDesc = `• Tile & Grout Deep Steam Extraction`;
      if (tileSqft) tileDesc += ` (approx ${tileSqft} sq ft)`;
      if (isSealantChecked) tileDesc += ` + Protective Grout Sealant`;
      requestedItems.push(tileDesc);
    }

    if (cars > 0) requestedItems.push(`• Vehicle Interior (Seats & Carpet): ${cars}`);

    if (petUrineRooms > 0) requestedItems.push(`• Pet Urine Enzymatic Treatment: ${petUrineRooms} room(s)`);
    if (isPetHairChecked) requestedItems.push(`• High-power embedded pet hair extraction`);
  } else {
    if (rooms > 0) requestedItems.push(`• Habitaciones alfombra: ${rooms} (aprox 13x15 ft)`);
    if (hallways > 0) requestedItems.push(`• Pasillos: ${hallways}`);
    if (stairs > 0) requestedItems.push(`• Tramos de escaleras: ${stairs}`);

    if (sofa3 > 0) requestedItems.push(`• Sofá 3 Plazas: ${sofa3}`);
    if (sofaL > 0) requestedItems.push(`• Sala Seccional en "L": ${sofaL}`);
    if (armchair > 0) requestedItems.push(`• Sillón individual / reclinable: ${armchair}`);
    if (chairs > 0) requestedItems.push(`• Sillas de comedor: ${chairs}`);

    if (mattressKing > 0) requestedItems.push(`• Colchón King/Cal-King: ${mattressKing}`);
    if (mattressQueen > 0) requestedItems.push(`• Colchón Queen/Full: ${mattressQueen}`);
    if (mattressTwin > 0) requestedItems.push(`• Colchón Twin/Individual: ${mattressTwin}`);

    if (isTileChecked) {
      let tileDesc = `• Lavado de Pisos (Tile & Grout)`;
      if (tileSqft) tileDesc += ` aprox ${tileSqft} sq ft`;
      if (isSealantChecked) tileDesc += ` + Sellador protector`;
      requestedItems.push(tileDesc);
    }

    if (cars > 0) requestedItems.push(`• Interior de autos/camionetas: ${cars}`);

    if (petUrineRooms > 0) requestedItems.push(`• Tratamiento enzimático orina: ${petUrineRooms} habitación(es)`);
    if (isPetHairChecked) requestedItems.push(`• Extracción mecánica de pelo de mascota`);
  }

  if (requestedItems.length === 0) {
    alert(isEn
      ? "Please select at least one area, furniture piece, or service to request an estimate."
      : "Por favor selecciona al menos un área, mueble o servicio para cotizar.");
    return;
  }

  // Compose Message
  let msg = '';
  if (isEn) {
    msg = `👋 *Hello Claudia! I would like to request a cleaning service with Esparza's Carpet Cleaning:*\n\n`;
    msg += `👤 *Customer:* ${name}\n`;
    msg += `📱 *Phone:* ${phone}\n`;
    msg += `📍 *Address:* ${address}, ${city}, AZ ${zip}\n\n`;
    msg += `📋 *Requested Services:*\n${requestedItems.join('\n')}\n\n`;
    msg += `📅 *Tentative Date:* ${prefDate} (${prefTime})\n`;
    if (notes) {
      msg += `📝 *Notes/Stains:* ${notes}\n`;
    }
    msg += `\n📸 *NOTE:* I am attaching photos of my furniture/carpets/floors right now in this chat so you can provide the exact flat quote and secure my appointment. Thank you!`;
  } else {
    msg = `👋 *¡Hola Claudia! Deseo solicitar un servicio con Esparza's Carpet Cleaning:*\n\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `📱 *Teléfono:* ${phone}\n`;
    msg += `📍 *Dirección:* ${address}, ${city}, AZ ${zip}\n\n`;
    msg += `📋 *Servicios Requeridos:*\n${requestedItems.join('\n')}\n\n`;
    msg += `📅 *Fecha Tentativa:* ${prefDate} (${prefTime})\n`;
    if (notes) {
      msg += `📝 *Detalles/Manchas:* ${notes}\n`;
    }
    msg += `\n📸 *NOTA:* En este momento te adjunto las fotos de mis muebles/manchas en este chat para que me confirmes el presupuesto exacto y asegures mi espacio. ¡Muchas gracias!`;
  }

  const waUrl = `https://wa.me/16025759974?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}
