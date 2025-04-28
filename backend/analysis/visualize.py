import matplotlib.pyplot as plt
import io
import base64

def generate_chart(data, chart_type='line'):
    df = pd.DataFrame(data)

    fig, ax = plt.subplots()
    if chart_type == 'line':
        df.plot(ax=ax)
    elif chart_type == 'bar':
        df.plot.bar(ax=ax)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{encoded}"
