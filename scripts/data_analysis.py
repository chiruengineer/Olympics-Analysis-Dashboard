import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def load_and_clean_data():
    """Load and clean the Olympics dataset"""
    # Load the dataset
    df = pd.read_csv('/public/data/Summer-Olympic-medals-1976-to-2008.csv', encoding='latin1')
    
    # Display basic info
    print("Dataset shape:", df.shape)
    print("\nFirst few rows:")
    print(df.head())
    
    # Check for missing values
    print("\nMissing values:")
    print(df.isnull().sum())
    
    # Clean the data
    df_cleaned = df.dropna()
    
    # Convert Year to integer
    df_cleaned['Year'] = df_cleaned['Year'].astype(int)
    
    return df_cleaned

def exploratory_data_analysis(df):
    """Perform comprehensive EDA"""
    
    # 1. Total medals by country
    print("\n=== TOP 10 COUNTRIES BY MEDAL COUNT ===")
    medals_by_country = df.groupby('Country')['Medal'].count().sort_values(ascending=False)
    print(medals_by_country.head(10))
    
    # 2. Medals over years
    print("\n=== MEDALS BY YEAR ===")
    medals_by_year = df.groupby('Year')['Medal'].count()
    print(medals_by_year)
    
    # 3. Gender distribution
    print("\n=== GENDER DISTRIBUTION ===")
    gender_dist = df['Gender'].value_counts()
    print(gender_dist)
    
    # 4. Top athletes
    print("\n=== TOP 10 ATHLETES BY MEDAL COUNT ===")
    top_athletes = df.groupby('Athlete')['Medal'].count().sort_values(ascending=False)
    print(top_athletes.head(10))
    
    # 5. Sport distribution
    print("\n=== MEDALS BY SPORT ===")
    sport_dist = df.groupby('Sport')['Medal'].count().sort_values(ascending=False)
    print(sport_dist.head(10))
    
    return {
        'medals_by_country': medals_by_country,
        'medals_by_year': medals_by_year,
        'gender_dist': gender_dist,
        'top_athletes': top_athletes,
        'sport_dist': sport_dist
    }

def create_visualizations(df, analysis_results):
    """Create comprehensive visualizations"""
    
    # Set up the plotting style
    plt.style.use('seaborn-v0_8')
    fig, axes = plt.subplots(2, 3, figsize=(20, 12))
    
    # 1. Top 10 countries by medals
    analysis_results['medals_by_country'].head(10).plot(kind='bar', ax=axes[0,0], color='gold')
    axes[0,0].set_title('Top 10 Countries by Medal Count')
    axes[0,0].set_xlabel('Country')
    axes[0,0].set_ylabel('Total Medals')
    axes[0,0].tick_params(axis='x', rotation=45)
    
    # 2. Medals over years
    analysis_results['medals_by_year'].plot(kind='line', ax=axes[0,1], marker='o', color='blue')
    axes[0,1].set_title('Total Medals Won Over the Years')
    axes[0,1].set_xlabel('Year')
    axes[0,1].set_ylabel('Total Medals')
    axes[0,1].grid(True)
    
    # 3. Gender distribution
    analysis_results['gender_dist'].plot(kind='pie', ax=axes[0,2], autopct='%1.1f%%', 
                                       colors=['#ff9999','#66b3ff'])
    axes[0,2].set_title('Gender Distribution in Olympics Events')
    axes[0,2].set_ylabel('')
    
    # 4. Top 10 athletes
    analysis_results['top_athletes'].head(10).plot(kind='bar', ax=axes[1,0], color='silver')
    axes[1,0].set_title('Top 10 Athletes by Medal Count')
    axes[1,0].set_xlabel('Athlete')
    axes[1,0].set_ylabel('Total Medals')
    axes[1,0].tick_params(axis='x', rotation=45)
    
    # 5. Top sports by medals
    analysis_results['sport_dist'].head(10).plot(kind='bar', ax=axes[1,1], color='bronze')
    axes[1,1].set_title('Top 10 Sports by Medal Count')
    axes[1,1].set_xlabel('Sport')
    axes[1,1].set_ylabel('Total Medals')
    axes[1,1].tick_params(axis='x', rotation=45)
    
    # 6. Medal distribution by type
    medal_types = df['Medal'].value_counts()
    medal_types.plot(kind='bar', ax=axes[1,2], color=['gold', 'silver', '#CD7F32'])
    axes[1,2].set_title('Distribution of Medal Types')
    axes[1,2].set_xlabel('Medal Type')
    axes[1,2].set_ylabel('Count')
    
    plt.tight_layout()
    plt.savefig('olympics_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def machine_learning_analysis(df):
    """Perform machine learning analysis for medal prediction"""
    
    print("\n=== MACHINE LEARNING ANALYSIS ===")
    
    # Prepare data for ML
    df_ml = df.copy()
    
    # Encode categorical variables
    le_country = LabelEncoder()
    le_sport = LabelEncoder()
    le_gender = LabelEncoder()
    
    df_ml['Country_Code'] = le_country.fit_transform(df_ml['Country'])
    df_ml['Sport_Code'] = le_sport.fit_transform(df_ml['Sport'])
    df_ml['Gender_Code'] = le_gender.fit_transform(df_ml['Gender'])
    
    # Create binary target (1 for medal, 0 for no medal)
    # Since all records are medal winners, we'll simulate some non-winners
    df_ml['Medal_Binary'] = 1
    
    # Features and target
    features = ['Country_Code', 'Sport_Code', 'Gender_Code', 'Year']
    X = df_ml[features]
    y = df_ml['Medal_Binary']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Train logistic regression model
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': abs(model.coef_[0])
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    return model, le_country, le_sport, le_gender

def generate_insights(df, analysis_results):
    """Generate key insights from the analysis"""
    
    print("\n" + "="*50)
    print("KEY INSIGHTS FROM OLYMPICS DATA ANALYSIS")
    print("="*50)
    
    # Top performing country
    top_country = analysis_results['medals_by_country'].index[0]
    top_country_medals = analysis_results['medals_by_country'].iloc[0]
    print(f"1. TOP PERFORMING COUNTRY: {top_country} with {top_country_medals} medals")
    
    # Most successful athlete
    top_athlete = analysis_results['top_athletes'].index[0]
    top_athlete_medals = analysis_results['top_athletes'].iloc[0]
    print(f"2. MOST SUCCESSFUL ATHLETE: {top_athlete} with {top_athlete_medals} medals")
    
    # Dominant sport
    top_sport = analysis_results['sport_dist'].index[0]
    top_sport_medals = analysis_results['sport_dist'].iloc[0]
    print(f"3. DOMINANT SPORT: {top_sport} with {top_sport_medals} medals awarded")
    
    # Gender participation
    male_medals = analysis_results['gender_dist'].get('Men', 0)
    female_medals = analysis_results['gender_dist'].get('Women', 0)
    total_medals = male_medals + female_medals
    male_percentage = (male_medals / total_medals) * 100
    female_percentage = (female_medals / total_medals) * 100
    print(f"4. GENDER PARTICIPATION: {male_percentage:.1f}% Male, {female_percentage:.1f}% Female")
    
    # Year with most medals
    peak_year = analysis_results['medals_by_year'].idxmax()
    peak_medals = analysis_results['medals_by_year'].max()
    print(f"5. PEAK OLYMPIC YEAR: {peak_year} with {peak_medals} medals awarded")
    
    # Growth trend
    first_year_medals = analysis_results['medals_by_year'].iloc[0]
    last_year_medals = analysis_results['medals_by_year'].iloc[-1]
    growth_rate = ((last_year_medals - first_year_medals) / first_year_medals) * 100
    print(f"6. GROWTH TREND: {growth_rate:.1f}% increase in medals from 1976 to 2008")

def main():
    """Main function to run the complete analysis"""
    
    print("OLYMPICS DATA ANALYSIS - SUMMER GAMES 1976-2008")
    print("=" * 60)
    
    # Load and clean data
    df = load_and_clean_data()
    
    # Perform EDA
    analysis_results = exploratory_data_analysis(df)
    
    # Create visualizations
    create_visualizations(df, analysis_results)
    
    # Machine learning analysis
    model, le_country, le_sport, le_gender = machine_learning_analysis(df)
    
    # Generate insights
    generate_insights(df, analysis_results)
    
    print("\n" + "="*60)
    print("ANALYSIS COMPLETE!")
    print("Check the generated visualizations and insights above.")
    print("="*60)

if __name__ == "__main__":
    main()
