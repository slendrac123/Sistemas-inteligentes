file = open("output", "r")

list_data = file.readlines()

min_val = 99999999999
max_val = -9999999999999
for i in list_data:
    if int(i) < min_val:
        min_val = int(i)
    elif int(i) > max_val:
        max_val = int(i)

print(min_val)
print(max_val)
