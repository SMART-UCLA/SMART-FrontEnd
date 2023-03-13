import pandas as pd
import sys
# import matplotlib.pyplot as plt

path = sys.stdin.read()[:-1]
print(path)
print("hi")
data = pd.read_csv(path, header = 0)
print(data.head())
# print(data.iloc[[123]])
res = data.plot(x = 'TIME',y = 'CH1', kind = 'scatter').get_figure()
res.savefig('../assets/plot.png')