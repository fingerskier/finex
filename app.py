import eel
import os
from backend.data import loader, processor
from backend.analysis import stats, visualize


# Config
DEV_MODE = os.getenv('DEV', 'false').lower() == 'true'

if DEV_MODE:
    eel.init('frontend')  # serve Vite source directly
else:
    eel.init('dist')      # serve built Vite output


@eel.expose
def clean_and_sort(data):
    cleaned = processor.fill_missing(data, value=0)
    sorted_data = processor.sort_data(cleaned, by_column='Revenue', ascending=False)
    return sorted_data

@eel.expose
def health_check():
    return "OK"

# Expose backend functions to JS
@eel.expose
def load_data(filepath):
    return loader.load_csv(filepath)

@eel.expose
def get_summary(data):
    return stats.summary_statistics(data)

@eel.expose
def plot_data(data, chart_type='line'):
    return visualize.generate_chart(data, chart_type)


# Launch
if DEV_MODE:
  eel.start(
    {
      'port': 5173  # Vite dev server
    },
    size=(800, 600),
    mode='default'
  )
else:
  eel.start(
    'index.html',    # from dist/
    size=(800, 600)
  )