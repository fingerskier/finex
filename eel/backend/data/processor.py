import pandas as pd

def filter_rows(data, condition):
    """
    Filters rows based on a condition function.
    :param data: List of dicts (records) or DataFrame
    :param condition: A function that takes a row (Series) and returns True/False
    :return: Filtered list of records
    """
    df = pd.DataFrame(data) if not isinstance(data, pd.DataFrame) else data
    filtered_df = df[df.apply(condition, axis=1)]
    return filtered_df.to_dict(orient='records')


def select_columns(data, columns):
    """
    Select specific columns from the data.
    :param data: List of dicts or DataFrame
    :param columns: List of column names to select
    :return: List of records with only selected columns
    """
    df = pd.DataFrame(data) if not isinstance(data, pd.DataFrame) else data
    selected_df = df[columns]
    return selected_df.to_dict(orient='records')


def fill_missing(data, value=0):
    """
    Fill missing values in the dataset.
    :param data: List of dicts or DataFrame
    :param value: Value to replace NaNs with
    :return: Cleaned list of records
    """
    df = pd.DataFrame(data) if not isinstance(data, pd.DataFrame) else data
    filled_df = df.fillna(value)
    return filled_df.to_dict(orient='records')


def add_computed_column(data, column_name, compute_func):
    """
    Add a new column computed from existing row data.
    :param data: List of dicts or DataFrame
    :param column_name: Name of the new column
    :param compute_func: Function that takes a row (Series) and returns a value
    :return: Updated list of records
    """
    df = pd.DataFrame(data) if not isinstance(data, pd.DataFrame) else data
    df[column_name] = df.apply(compute_func, axis=1)
    return df.to_dict(orient='records')


def sort_data(data, by_column, ascending=True):
    """
    Sort data by a specific column.
    :param data: List of dicts or DataFrame
    :param by_column: Column name to sort by
    :param ascending: Sort ascending or descending
    :return: Sorted list of records
    """
    df = pd.DataFrame(data) if not isinstance(data, pd.DataFrame) else data
    sorted_df = df.sort_values(by=by_column, ascending=ascending)
    return sorted_df.to_dict(orient='records')
