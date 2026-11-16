const SOURCE = "https://raw.githubusercontent.com/ketanvats/DronxtuROMs/master/";
const romData = [
    {"id":364189,"title":"Reborn UI 3.0 A15","url":"https://t.me/mt6833unified_chat/364189","meta":["HyperOS 3.0","Android 15","Hybrid Rom"],"desc":"The newest iteration of Reborn UI featuring Android 15. Check out the screenshots!","images":["Reborn UI 3.0 A15 Screenshot/photo_6115943678032416919_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6115943678032416920_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6115943678032416921_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118182395375719168_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118182395375719170_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118189039690125882_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118189039690125884_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118189039690125885_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118189039690125887_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118189039690125888_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118687036853130996_w.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118696666169807433_y.jpg","Reborn UI 3.0 A15 Screenshot/photo_6118696666169807434_y.jpg"]},
    {"id":1461,"title":"Reborn UI Extended","url":"https://t.me/mt6833unified_updates/1461","meta":["HyperOS","Android 14","Hybrid Rom"],"desc":"The ultimate HyperOS experience for POCO M4 Pro 5G. Extended edition by dronxtu.","images":["Reborn ui extended screenshot/photo_6242043333727424517_y.jpg","Reborn ui extended screenshot/photo_6242043333727424518_y.jpg","Reborn ui extended screenshot/photo_6242043333727424519_y.jpg","Reborn ui extended screenshot/photo_6242043333727424520_y.jpg","Reborn ui extended screenshot/photo_6242043333727424521_y.jpg","Reborn ui extended screenshot/photo_6242043333727424522_y.jpg","Reborn ui extended screenshot/photo_6242043333727424523_y.jpg","Reborn ui extended screenshot/photo_6242043333727424524_y.jpg","Reborn ui extended screenshot/photo_6242043333727424525_y.jpg","Reborn ui extended screenshot/photo_6242043333727424526_y.jpg","Reborn ui extended screenshot/photo_6242043333727424527_y.jpg","Reborn ui extended screenshot/photo_6242043333727424528_y.jpg","Reborn ui extended screenshot/photo_6242043333727424529_y.jpg"]},
    {"id":1472,"title":"Xiaomi HyperOS 3.1","url":"https://t.me/mt6833unified_updates/1472","meta":["HyperOS 3.1","Android 16","Hybrid Rom"],"desc":"Ported from Device: Redmi note 14 5g(beryl). Version: OS3.0.301.0.WOQINXM Indian Global Hybrid Rom.","images":["Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533116_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533117_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533118_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533119_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533120_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533123_y.jpg","Xiaomi HyperOS 3.1 Screenshot/photo_6271750089210533125_y.jpg"]},
    {"id":1445,"title":"MemeOS | Evergo","url":"https://t.me/mt6833unified_updates/1445","meta":["MIUI 14","Android 13","MemeOS"],"desc":"Release Date: 02/07/2026 · Base ROM: MIUI 14.0.8.0.TKTCNXM · ROM Credit: @Rolex040623 · Maintainer: @dronxtu","images":["Meme os screenshot/photo_6291892356248615269_y.jpg","Meme os screenshot/photo_6291892356248615270_y.jpg","Meme os screenshot/photo_6291892356248615271_y.jpg","Meme os screenshot/photo_6291892356248615272_y.jpg","Meme os screenshot/photo_6291892356248615273_y.jpg","Meme os screenshot/photo_6291892356248615274_y.jpg","Meme os screenshot/photo_6291892356248615275_y.jpg","Meme os screenshot/photo_6291892356248615277_y.jpg","Meme os screenshot/photo_6291892356248615278_y.jpg","Meme os screenshot/photo_6291892356248615280_y.jpg","Meme os screenshot/photo_6291892356248615281_y.jpg","Meme os screenshot/photo_6291892356248615282_y.jpg","Meme os screenshot/photo_6291892356248615283_y.jpg","Meme os screenshot/photo_6291892356248615284_y.jpg","Meme os screenshot/photo_6291892356248615285_y.jpg","Meme os screenshot/photo_6291892356248615287_y.jpg"]},
    {"id":1433,"title":"Reborn UI 2.0 A16","url":"https://t.me/mt6833unified_updates/1433","meta":["HyperOS","Android 16","Hybrid Rom"],"desc":"Next generation Reborn UI on Android 16. Hybrid Rom for Evergo, Evergreen, Opal.","images":["Reborn ui extended screenshot/post_1433_0.jpg"]},
    {"id":1400,"title":"Reborn UI","url":"https://t.me/mt6833unified_updates/1400","meta":["OS 3.0.7","Android 15","CN Base"],"desc":"Released: 08/06/2026 · Base: OS3.0.7.0 VLNCNXM | A15 | CN ROM · Flashing Type: Hybrid Rom","images":["Reborn UI screenshot/photo_6120550515788680741_w.jpg","Reborn UI screenshot/photo_6120550515788680742_w.jpg","Reborn UI screenshot/photo_6120550515788680744_w.jpg","Reborn UI screenshot/photo_6120550515788680745_w.jpg","Reborn UI screenshot/photo_6120550515788680746_w.jpg","Reborn UI screenshot/photo_6120550515788680747_w.jpg","Reborn UI screenshot/photo_6120550515788680748_w.jpg","Reborn UI screenshot/photo_6120550515788680749_w.jpg","Reborn UI screenshot/photo_6120550515788680750_w.jpg","Reborn UI screenshot/photo_6120550515788680751_w.jpg","Reborn UI screenshot/photo_6120550515788680752_w.jpg","Reborn UI screenshot/photo_6125226987849715646_y.jpg","Reborn UI screenshot/photo_6125226987849715647_y.jpg","Reborn UI screenshot/photo_6125226987849715648_y.jpg","Reborn UI screenshot/photo_6125226987849715650_y.jpg"]}
];

const imageSource = (path) => SOURCE + path.split('/').map(encodeURIComponent).join('/');

const openDialog = (id) => {
    const dialog = document.getElementById(id);
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
};

const closeDialog = (id) => {
    const dialog = document.getElementById(id);
    if (dialog) dialog.close();
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({ once: true, offset: 45, duration: 800, easing: 'ease-out-cubic' });
    }

    const romContainer = document.getElementById('rom-container');
    const latestContainer = document.getElementById('latest-container');
    const gallerySection = document.getElementById('gallery');
    const galleryContainer = document.getElementById('gallery-container');
    const galleryTitle = document.getElementById('gallery-title');
    const telegramDialog = document.getElementById('telegram-dialog');

    const createRomCard = (rom, index) => {
        const card = document.createElement('article');
        card.className = 'rom-card';
        card.dataset.aos = 'fade-up';
        card.dataset.aosDelay = String(index * 90);

        const header = document.createElement('div');
        header.className = 'rom-header';

        const title = document.createElement('h3');
        title.className = 'rom-title';
        title.textContent = rom.title;

        const meta = document.createElement('div');
        meta.className = 'rom-meta';
        rom.meta.forEach((item) => {
            const tag = document.createElement('span');
            tag.textContent = item;
            meta.append(tag);
        });

        const desc = document.createElement('div');
        desc.className = 'rom-desc';
        desc.textContent = rom.desc;

        const actions = document.createElement('div');
        actions.className = 'rom-actions';

        const release = document.createElement('a');
        release.href = rom.url;
        release.target = '_blank';
        release.rel = 'noopener noreferrer';
        release.className = 'btn-small btn-download';
        release.textContent = 'View release';

        const galleryButton = document.createElement('button');
        galleryButton.type = 'button';
        galleryButton.className = 'btn-small btn-gallery';
        galleryButton.textContent = 'Screenshots';
        galleryButton.addEventListener('click', () => showGallery(rom));

        header.append(title, meta, desc);
        actions.append(release, galleryButton);
        card.append(header, actions);
        return card;
    };

    const showGallery = (rom) => {
        galleryContainer.replaceChildren();
        galleryTitle.textContent = rom.title;

        rom.images.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const image = document.createElement('img');
            image.src = imageSource(imgSrc);
            image.alt = `${rom.title} screenshot ${index + 1}`;
            image.loading = 'lazy';
            slide.append(image);
            galleryContainer.append(slide);
        });

        gallerySection.style.display = 'block';

        if (window.mySwiper) {
            window.mySwiper.destroy(true, true);
        }

        if (window.Swiper) {
            window.mySwiper = new Swiper('#gallery-swiper', {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                initialSlide: 1,
                loop: rom.images.length > 2,
                speed: 800,
                coverflowEffect: {
                    rotate: 15,
                    stretch: 0,
                    depth: 250,
                    modifier: 1,
                    slideShadows: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                keyboard: { enabled: true },
                mousewheel: { sensitivity: 1, releaseOnEdges: true },
            });
        }

        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (romData.length > 0 && latestContainer) {
        const latestCard = createRomCard(romData[0], 0);
        latestCard.classList.add('latest-release-card');
        latestContainer.append(latestCard);
    }

    romData.forEach((rom, index) => romContainer.appendChild(createRomCard(rom, index)));

    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll('.rom-card'));
    }

    document.getElementById('open-telegram').addEventListener('click', () => openDialog('telegram-dialog'));
    document.getElementById('hero-telegram').addEventListener('click', () => openDialog('telegram-dialog'));
    document.getElementById('close-telegram').addEventListener('click', () => closeDialog('telegram-dialog'));
    telegramDialog.addEventListener('click', (event) => {
        if (event.target === telegramDialog) closeDialog('telegram-dialog');
    });

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = () => {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    galleryContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName !== 'IMG') return;
        modalImg.src = target.src;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => modal.classList.add('show'));
        document.body.style.overflow = 'hidden';
    });

    document.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (modal.style.display === 'block') closeModal();
            if (telegramDialog.open) closeDialog('telegram-dialog');
        }
    });

    if (window.AOS) AOS.refresh();
});
