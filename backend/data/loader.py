import pandas as pd

def load_csv(filepath):
    return pd.read_csv(filepath).to_dict(orient='records')

def save_csv(data, filepath):
    df = pd.DataFrame(data)
    df.to_csv(filepath, index=False)
