# Olympics Data Analysis - Summer Games 1976-2008

A comprehensive web application for analyzing Summer Olympic medal data from 1976 to 2008, featuring interactive visualizations, statistical analysis, and machine learning predictions.

## 🏆 Features

### Data Analysis
- **Comprehensive EDA**: Exploratory data analysis with statistical summaries
- **Interactive Visualizations**: Charts and graphs using Recharts
- **Country Performance**: Medal distribution and trends by country
- **Athlete Analysis**: Top performers and their achievements
- **Sport Statistics**: Distribution across different sports and disciplines
- **Gender Analysis**: Participation trends and gender distribution
- **Temporal Trends**: Performance changes over time

### Machine Learning
- **Medal Prediction**: ML model to predict medal probabilities
- **Feature Engineering**: Country, sport, and demographic factors
- **Model Evaluation**: Accuracy metrics and performance analysis

### Web Application
- **Modern UI**: Built with Next.js 14 and Tailwind CSS
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Dashboard**: Real-time data exploration
- **Data Explorer**: Search and filter through records
- **Professional Design**: Clean, modern interface

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone or Download the Project**
   \`\`\`bash
   # If you have the code, navigate to the project directory
   cd olympics-analysis-app
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open Your Browser**
   Navigate to `http://localhost:3000`

### Project Structure
\`\`\`
olympics-analysis-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Analytics dashboard
│   ├── data-explorer/     # Data exploration interface
│   ├── predictions/       # ML predictions
│   └── api/              # API routes
├── components/            # React components
│   ├── charts/           # Chart components
│   ├── ui/               # UI components (shadcn/ui)
│   └── navigation.tsx    # Navigation component
├── lib/                  # Utilities and data processing
├── scripts/              # Python and SQL scripts
├── public/data/          # Dataset files
└── README.md
\`\`\`

## 📊 Dataset Information

**Source**: Summer Olympic medals from 1976 Montreal to 2008 Beijing
**Records**: ~29,000 medal records
**Columns**:
- City: Host city
- Year: Olympic year
- Sport: Sport category
- Discipline: Sport discipline
- Event: Specific event
- Athlete: Athlete name
- Gender: Male/Female
- Country: Country name
- Medal: Gold/Silver/Bronze

## 🔧 Technical Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

### Backend & Data
- **Python**: Data analysis and ML
- **pandas**: Data manipulation
- **matplotlib/seaborn**: Data visualization
- **scikit-learn**: Machine learning
- **SQL**: Database queries and analysis

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📈 Analysis Features

### 1. Dashboard Overview
- Summary statistics
- Medal trends over time
- Top performing countries
- Sport distribution
- Gender participation

### 2. Country Analysis
- Medal counts by country
- Historical performance trends
- Sport specializations
- Year-over-year comparisons

### 3. Athlete Analysis
- Top medal winners
- Multi-sport athletes
- Career spans and achievements
- Country representations

### 4. Sport Analysis
- Medal distribution by sport
- Gender participation rates
- Event categories
- Popularity trends

### 5. Trend Analysis
- Temporal patterns
- Growth in participation
- Emerging sports
- Regional dominance

### 6. Gender Analysis
- Male vs female participation
- Sport-specific gender distribution
- Historical progression
- Equality trends

### 7. ML Predictions
- Medal probability calculator
- Feature importance analysis
- Model performance metrics
- Prediction confidence intervals

## 🔍 Data Processing

### Python Analysis Script
The `scripts/data_analysis.py` file contains:
- Data loading and cleaning
- Exploratory data analysis
- Statistical computations
- Visualization generation
- Machine learning model training

### SQL Database Schema
The `scripts/create_database.sql` includes:
- Table definitions
- Indexes for performance
- Views for common queries
- Summary tables for analytics

### Data Processing Library
The `lib/data-processor.ts` provides:
- CSV parsing utilities
- Statistical analysis functions
- ML data preparation
- Prediction algorithms

## 🎯 Key Insights

Based on the analysis, key findings include:

1. **Top Performing Countries**: United States, Soviet Union, Germany
2. **Most Successful Athlete**: Michael Phelps (16 medals)
3. **Dominant Sports**: Athletics, Aquatics, Gymnastics
4. **Gender Participation**: Historical male dominance with increasing female participation
5. **Growth Trends**: Steady increase in medal counts and participating nations

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational purposes. The Olympic data is used for analysis and learning.

## 🙏 Acknowledgments

- Olympic data from historical records
- Next.js and React communities
- Open source libraries and tools
- Data visualization best practices

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Provide reproduction steps

---

**Built with ❤️ for Olympic data enthusiasts and data science learners**
