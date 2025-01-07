class NewsPanel {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container.className = 'panel-content news-content';
        this.loadNews();
    }

    async loadNews() {
        const featuredNews = this.createFeaturedNews({
            image: 'assets/images/news/featured.jpg',
            title: 'Nova Dungeon: Cavernas de Cristal',
            date: '2025-01-06',
            tag: 'Evento',
            summary: 'Uma nova era começa em TarenOnline com a chegada dos Dragões Ancestrais!'
        });

        const newsList = this.createNewsList([
            {
                title: 'Notas da Atualização v2.5.0',
                date: '2025-01-05',
                tag: 'Atualização',
                summary: 'Confira todas as novidades e melhorias desta atualização'
            },
            {
                title: 'Festival de Ano Novo',
                date: '2025-01-03',
                tag: 'Evento',
                summary: 'Celebre o ano novo com eventos especiais e recompensas exclusivas'
            },
            {
                title: 'Manutenção Programada',
                date: '2025-01-01',
                tag: 'Manutenção',
                summary: 'Servidores em manutenção para melhorias de performance'
            }
        ]);

        this.container.appendChild(featuredNews);
        this.container.appendChild(newsList);
    }

    createFeaturedNews({ image, title, date, tag, summary }) {
        const featured = document.createElement('div');
        featured.className = 'news-featured';

        featured.innerHTML = `
            <div class="news-image" style="background-image: url('${image}');">
                <div class="news-overlay">
                    <span class="news-tag ${tag.toLowerCase()}">${tag}</span>
                    <h3>${title}</h3>
                    <p>${summary}</p>
                    <button class="news-read-more">Saiba Mais</button>
                </div>
            </div>
        `;

        return featured;
    }

    createNewsList(news) {
        const list = document.createElement('div');
        list.className = 'news-list';

        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';

            const date = new Date(item.date);
            
            newsItem.innerHTML = `
                <div class="news-date">
                    <span class="day">${date.getDate()}</span>
                    <span class="month">${date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div class="news-info">
                    <span class="news-tag ${item.tag.toLowerCase()}">${item.tag}</span>
                    <h4>${item.title}</h4>
                    <p>${item.summary}</p>
                </div>
            `;

            list.appendChild(newsItem);
        });

        return list;
    }
}

export default NewsPanel;
