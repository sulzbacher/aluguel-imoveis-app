# 🏠 Decision Engine para Seleção e Ranking de Imóveis

Aplicação Full Stack local desenvolvida para centralizar, analisar e classificar imóveis para locação. O sistema combina **critérios quantitativos/automáticos** (custo total com contas, geocodificação de distâncias e cross-reference com mapa de risco de enchentes do RS) com **avaliações subjetivas e bônus manuais**.

---

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** com **Express**
- **@turf/turf**: Análise espacial e teste geométrico de ponto em polígono (GeoJSON).
- **OpenStreetMap / Nominatim API**: Geocodificação de endereços.
- **Axios & CORS**

### Frontend

- **React 18** + **Vite**
- **Tailwind CSS**: Estilização moderna e responsiva em Dark Mode.
- **Lucide React**: Biblioteca de ícones.
- **React Router DOM v7**

---

## 🎯 Principais Funcionalidades

1. **Análise Geográfica & Risco de Inundação**:
   - Geocodificação automática do endereço do imóvel.
   - Cross-reference espacial com a mancha de enchente de maio/2024 do RS (`.geojson`).
   - Cálculo automático de distância até pontos de interesse frequentes (ex: local de trabalho e aeroporto).

2. **Cálculo de Orçamento Real**:
   - Soma custos da imobiliária (aluguel, condomínio e IPTU) com estimativas de despesas fixas (luz, água, internet, gás e telefone).
   - Aplica bônus para imóveis dentro do limite orçamentário configurável e penalidade proporcional para os excedentes.

3. **Pontuação e Ranking Dinâmico**:
   - Atributos estruturais booleanos (fácil de telar para gatos, quintal nos fundos, vagas de garagem, número de quartos).
   - **Bônus/Ônus Manuais e Anotações Individuais**: Espaço dedicado para o casal inserir notas abertas (personalidade do imóvel, iluminação, vibe) e ajustar modificadores de pontuação individuais em tempo real.
   - Alternância de visualização entre **Cards Detalhados** e **Tabela Comparativa Side-by-Side**.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **npm** (v9 ou superior)

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/SEU_USUARIO/aluguel-imoveis-app.git](https://github.com/SEU_USUARIO/aluguel-imoveis-app.git)
   cd aluguel-imoveis-app
   ```

2. **Instale as dependências (Backend e Frontend):**

   ```bash
   npm run setup
   ```

3. **Inicie o servidor e o frontend simultaneamente:**

   ```bash
   npm start
   ```

4. **Acesse a aplicação no seu navegador:**
   - **Frontend:** `http://localhost:5173`
   - **Backend API:** `http://localhost:3001`

---

## ⚙️ Estrutura de Arquivos de Configuração

- `backend/data/config_orcamento.json`: Define o teto orçamentário mensal e os custos variáveis médios.
- `backend/data/mancha_enchentes.geojson`: Polígonos geográficos das áreas de risco de inundação.
- `backend/data/imoveis.json`: Persistência local dos imóveis cadastrados.

---

## 📄 Licença

Este projeto está sob a licença MIT.
