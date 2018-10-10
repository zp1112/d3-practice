export default function (url, params) {
  try {
    let inputs = '';
    const method = 'POST';
    for (const key of Object.keys(params)) {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        inputs += `<input type="hidden" name="${key}" value="${params[key]}" />`;
      }
    }
    const div = document.createElement('div');
    div.setAttribute('id', 'temp')
    div.innerHTML = `<form id="tempform" name="tempform" target="_blank" action="${  url  }" method="${  method || 'post'  }">${  inputs  }</form>`;
    document.body.appendChild(div);
    const tempForm = document.getElementById('tempform');
    tempForm.submit();
    document.getElementById('temp').remove();
  } catch (error) {
    document.getElementById('temp').remove();
  }
}