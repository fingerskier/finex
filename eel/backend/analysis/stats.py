import pandas as pd

def summary_statistics(data):
    df = pd.DataFrame(data)
    return df.describe().to_dict()
