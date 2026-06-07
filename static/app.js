document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const resultsDiv = document.getElementById('results');
    const recommendationsDiv = document.getElementById('recommendations');
    const loadingDiv = document.getElementById('loading');
    const recPlaceholder = '<p class="placeholder">Pilih produk dari hasil pencarian untuk melihat rekomendasi.</p>';

    let searchTimeout;

    // --- Event Listeners ---
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(searchInput.value);
        }, 300); // Debounce search input
    });

    // --- Functions ---
    const handleSearch = async (query) => {
        if (query.trim() === '') {
            resultsDiv.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Network response was not ok.');

            const data = await response.json();
            renderSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            resultsDiv.innerHTML = '<p class="placeholder">Gagal memuat hasil pencarian.</p>';
        }
    };

    const renderSearchResults = (data) => {
        if (data.length === 0) {
            resultsDiv.innerHTML = '<p class="placeholder">Produk tidak ditemukan.</p>';
            return;
        }
        resultsDiv.innerHTML = data.map(item =>
            `<div class="item" data-product-id="${item.product_id}">${item.product_name}</div>`
        ).join('');

        // Add click listeners to new items
        document.querySelectorAll('.item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Visual feedback for selection
                document.querySelectorAll('.item').forEach(el => el.classList.remove('selected'));
                e.currentTarget.classList.add('selected');

                const productId = e.currentTarget.dataset.productId;
                loadRecommendations(productId);
            });
        });
    };

    const loadRecommendations = async (productId) => {
        showLoading(true);
        recommendationsDiv.innerHTML = '';

        try {
            const response = await fetch(`/api/recommend/${productId}`);
            if (!response.ok) throw new Error('Network response was not ok.');

            const data = await response.json();
            renderRecommendations(data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            recommendationsDiv.innerHTML = '<p class="placeholder">Gagal memuat rekomendasi.</p>';
        } finally {
            showLoading(false);
        }
    };

    const renderRecommendations = (data) => {
        if (data.length === 0) {
            recommendationsDiv.innerHTML = '<p class="placeholder">Tidak ada rekomendasi untuk produk ini.</p>';
            return;
        }
        recommendationsDiv.innerHTML = data.map(rec => `
            <div class="card">
                <h3>${rec.product_name}</h3>
                <p>${rec.category || 'No Category'}</p>
                <b>Score: ${rec.score.toFixed(4)}</b>
            </div>
        `).join('');
    };

    const showLoading = (isLoading) => {
        if (isLoading) {
            loadingDiv.classList.remove('hidden');
        } else {
            loadingDiv.classList.add('hidden');
        }
    };

    // --- Initial State ---
    recommendationsDiv.innerHTML = recPlaceholder;
});
