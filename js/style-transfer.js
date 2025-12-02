(() => {
  const $ = (sel) => document.querySelector(sel);

  const fileInput = $('#fileInput');
  const chooseBtn = $('#chooseBtn');
  const genBtn = $('#genBtn');
  const preview = $('#preview');
  const output = $('#output');
  const loader = $('#loader');
  const errorBox = $('#error');
  const downloadLink = $('#downloadLink');
  const dropzone = $('#dropzone');

  let blobUrl = null;
  let selectedFile = null;

  const resetOutput = () => {
    output.innerHTML = '<div class="hint">生成的图像将显示在这里</div>';
    errorBox.style.display = 'none';
    downloadLink.style.display = 'none';
    downloadLink.removeAttribute('href');
  };

  const setDisabled = (el, isDisabled) => {
    if (!el) return;
    // 兼容 <button> 与 <a>
    if ('disabled' in el) {
      el.disabled = !!isDisabled;
    }
    el.classList.toggle('disabled', !!isDisabled);
    el.setAttribute('aria-disabled', !!isDisabled);
  };

  const setLoading = (on) => {
    loader.classList.toggle('on', on);
    setDisabled(genBtn, on || !selectedFile);
    setDisabled(chooseBtn, on);
  };

  const showPreview = (file) => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(file);
    preview.innerHTML = '';
    const img = new Image();
    img.src = blobUrl;
    preview.appendChild(img);
  };

  const onFiles = (files) => {
    const file = files && files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件（image/*）');
      return;
    }
    selectedFile = file;
    showPreview(file);
    setDisabled(genBtn, false);
    resetOutput();
  };

  chooseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });
  fileInput.addEventListener('change', (e) => onFiles(e.target.files));

  // Drag & Drop
  ['dragenter', 'dragover'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    onFiles(e.dataTransfer.files);
  });

  genBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!selectedFile || genBtn.classList.contains('disabled')) return;
    setLoading(true);
    errorBox.style.display = 'none';

    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const res = await fetch('/api/hbh-style', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error((data && (data.detail || data.message)) || '生成失败');
      }

      let src = '';
      if (data.image_base64) {
        src = `data:image/png;base64,${data.image_base64}`;
      } else if (data.image_url) {
        src = data.image_url;
      } else {
        throw new Error('未获取到图像数据');
      }

      output.innerHTML = '';
      const img = new Image();
      img.src = src;
      output.appendChild(img);
      downloadLink.href = src;
      downloadLink.style.display = 'inline-flex';
    } catch (err) {
      errorBox.textContent = err.message || String(err);
      errorBox.style.display = 'block';
    } finally {
      setLoading(false);
    }
  });

  // 清空按钮
  const resetBtn = document.querySelector('#resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedFile = null;
      preview.innerHTML = '<div class="hint">将图片拖入此处，或点击下方按钮选择文件</div>';
      resetOutput();
      setDisabled(genBtn, true);
    });
  }
})();
