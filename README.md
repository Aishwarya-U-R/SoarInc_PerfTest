# 4. Logical and security testing
Logical and security vulnerabilities are available at [client_registeration](https://github.com/Aishwarya-U-R/SoarInc_PerfTest/blob/main/Risk_Score_Reports/client_registeration.pdf) & [client_login](https://github.com/Aishwarya-U-R/SoarInc_PerfTest/blob/main/Risk_Score_Reports/client_login.pdf)

# 5. Performance Testing
## Task 1
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

`Performance framework used in K6`
BDD Load test integrated to CI [here](https://github.com/Aishwarya-U-R/SoarInc_PerfTest/actions)

Once run completes (manual trigger for now) k6-Metrics & k6-Results are uploaded as artifacts into same pipeline run

## Task 2
Wiki mobile app Apptim Performance report availabe [here](https://github.com/Aishwarya-U-R/SoarInc_PerfTest/blob/main/Apptim_Report(WikiApp)/WikiApp_PerformanceReport.pdf)
