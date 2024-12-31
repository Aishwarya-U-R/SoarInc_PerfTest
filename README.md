git clone https://github.com/Galileo0/Soar_Test.git

cd Soarinc_Perftest

python3 -m venv venv

source venv/bin/activate

pip install -r requirments.txt

python3 db_init.py

python3 task.py

To run tests from project folder: `k6 run --out json=results.json tests/client_registration_load_test.js`
