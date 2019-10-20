/* eslint-disable prefer-template */
/* eslint-disable quotes */
const API_URL = '/scrape?url=';
const previewSection = document.querySelector('.preview');
const embedSection = document.querySelector('.embed');
form.addEventListener('submit', formSubmitted);

async function formSubmitted(event) {
  event.preventDefault();
  const response = await fetch(`${API_URL}${url.value}`);
  if (response.ok) {
    const json = await response.json();
    const { title, description, image, url, keywords } = json;

    const html = `<div style="outline:1px solid grey; padding: 1rem; text-align:center">
    <p>${title}</p>
    ${
      image === undefined
        ? ''
        : `<img src="${image}" style="max-width: 100%;"/>`
    }
    <p style="text-align: left;">${description}</p>
    <a href="${url}" style="display:block; text-align:left; margin-bottom:0.5rem;">${url}</a>
   <small style="text-align: left; display:block"><em>${keywords}</em></small>
    </div>`;
    previewSection.innerHTML = `<h2>Preview:</h2>` + html;
    embedSection.innerHTML = `<h2>Copy the HTML below:</h2><textarea class="source" rows="10">${html}</textarea>`;
  } else {
    error.textContent = 'Unable to get preview.';
    previewSection.innerHTML = '';
    embedSection.innerHTML = '';
  }

  return null;
}
