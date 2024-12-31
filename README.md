git clone https://github.com/Galileo0/Soar_Test.git

cd Soarinc_Perftest

python3 -m venv venv

source venv/bin/activate

pip install -r requirments.txt

python3 db_init.py

python3 task.py

go install go.k6.io/xk6/cmd/xk6@latest

xk6 build --with github.com/avitalique/xk6-file@latest

To run tests from project folder:
`./k6 run --out json=tests/testevidences/metrics.json tests/client_registration_load_test.js`
