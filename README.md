git clone https://github.com/Galileo0/Soar_Test.git

cd Soarinc_Perftest

python3 -m venv venv

source venv/bin/activate

pip install -r requirments.txt

python3 db_init.py

python3 task.py
