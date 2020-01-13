//Program.cpp
//Problem Statement - 
// #include "json.hpp"
// // for convenience
// using json = nlohmann::json;

#include <stdlib.h>


#include <bits/stdc++.h>
#include <map>
#include <unordered_map>
#include <algorithm>
using namespace std;


// #include <json/value.h>
#include <fstream>

//Author: Varun Goyal (@govarun)

#define f(i, n) for(int i=0;i<(n);++i)
#define fa(i, a, n) for(int i=(a);i<=(n);++i)
#define fd(i, a, n) for(int i=(a);i>=(n);--i)
#define all(x) x.begin(), x.end()
#define sz(x) (int)(x).size()
#define fill(a)  memset(a, 0, sizeof (a))
#define ff first
#define ss second
#define mp make_pair
#define pb push_back
#define popb pop_back
#define ull unsigned long long
#define debug if(GOVARUN) cerr
#define d0(x) debug <<#x<<" = "<<x<<' '
#define d1(x) debug <<"> "<<#x<<" = "<<x<<'\n'
#define d2(x, y) debug <<"> "<<#x<<" = "<<x<<' '<<#y<<" = "<<y<<'\n'
#define d3(x, y, z) debug <<"> "<<#x<<" = "<<x<<' '<<#y<<" = "<<y<<' '<<#z<<" = "<<z<<'\n'
#define endl '\n'
#define max3(a, b, c)  max(max(a, b), c)
#define min3(a, b, c)  min(min(a, b), c)

#define e(v) v.empty()
typedef long double ld;
typedef long long ll;
typedef pair<int, int> pii;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector< vector<ll> > vvl;
typedef vector< vector<int> > vvi;
typedef vector< pair<int, int> > vpii;
inline bool EQ(double a, double b) {return fabs(a-b) < 1e-9;}
inline int two(int n) { return 1 << n; }

const ll mod = 1e9 + 7;
const int maxn = 1e5 + 5;
// vector <int> adj[maxn];  
// bool vis[maxn];  
// int depth[maxn]; 
// int p[maxn]; 
// queue <int> q;

ll gcd(ll a, ll b){if(b==0)return a;return gcd(b, a%b);}
ll lcm(ll a, ll b){return a*(b/gcd(a, b));}
ll binexp(ll a, ll b){ll ans = 1;while(b){if(b&1) ans = ans*a%mod; b/=2;a=a*a%mod;}return ans;}
ll inverse(ll a, ll p){return binexp(a, p-2);}
// bool sortbysec(const pll &a, const pll &b){return (a.second < b.second);} 
void ingraph(vvl& graph, ll m){ll x, y; f(i, m){cin>>x>>y;x--, y--;graph[x].pb(y);graph[y].pb(x);}}

void solve();

int main(){
    ios::sync_with_stdio(0);    
    cin.tie(0); cout.tie(0);
    #ifdef GOVARUN
    freopen("input.txt", "r", stdin);
    freopen("output.txt", "w", stdout);
    #else 
    #define GOVARUN 0
    #endif
    int TC = 1;
    // cin >> TC;
    while(TC--){    
        solve();
        cout << "\n";
    }

    return 0;
}
typedef vector <pair <pair <double, double>, double> > vppddd;
typedef pair <pair <double, double>, double> ppddd;

bool sortByAngle(ppddd p1, ppddd p2) {
    return p1.second <= p2.second;
}

double haversine(double lat1, double lon1, 
                        double lat2, double lon2){ 

        double dLat = (lat2 - lat1) * 
                      M_PI / 180.0; 
        double dLon = (lon2 - lon1) *  
                      M_PI / 180.0; 
  

        lat1 = (lat1) * M_PI / 180.0; 
        lat2 = (lat2) * M_PI / 180.0; 
  

        double a = pow(sin(dLat / 2), 2) +  
                   pow(sin(dLon / 2), 2) *  
                   cos(lat1) * cos(lat2); 
        double rad = 6371; 
        double c = 2 * asin(sqrt(a)); 
        return rad * c; 
        // Code for haversine taken from: https://www.geeksforgeeks.org/haversine
        //-formula-to-find-distance-between-two-points-on-a-sphere/
    } 

double calcAngle (double latc, double lonc, double lat1, double lon1, double lat2, double lon2) {
    double a = abs(haversine(latc, lonc, lat1, lon1));
    double b = abs(haversine(latc, lonc, lat2, lon2));
    double c = abs(haversine(lat1, lon1, lat2, lon2));
    d3(a, b, c);
    return acos((a * a + b * b - c * c) / (2 * a * b)) / M_PI * 180;

}

void solve(){
    int totalEmployeeCount, busCapacity;
    // Values to be set
    busCapacity = 32;

    vppddd v1;

    fstream fin;
    fin.open("./coords.csv", ios::in);

    vector<string> row;
    double latcur, loncur, anglecur;
    string line, word, temp;
    int lineno = 0;

    while (fin >> temp) {
        // d1(temp);
        row.clear(); 
        getline(fin, line); 
        line = temp + line;
        stringstream s(line);
        // d1(line);
        // d1(s);
        while (getline(s, word, ',')) { 
            // cout<<word;
            row.push_back(word);
            // d1(word);
        }
        if (lineno == 0) {
            // d1(stoi(row[0]))
            totalEmployeeCount =  stoi(row[0]);

        } else {
            latcur = stod(row[0]);
            loncur = stod(row[1]);
            v1.pb(mp(mp(latcur, loncur), 0.0));
            d2(latcur, loncur);
        }
        lineno++;
        

    
    }
    // totalEmployeeCount--;

    // return;
    double lato, lono;
    lato = 12.797368;
    lono = 77.423862;
    // v1.pop_back();
    f (i, totalEmployeeCount) {
        latcur = v1[i].first.first;
        loncur = v1[i].first.second;
        v1[i].second = calcAngle(lato, lono, lato, lono + 0.002, latcur, loncur);

        d1(v1[i].second);
    }

    
    

    
    sort(all(v1), sortByAngle);
    int minOptimumCapacity= (int)ceil(0.85 * busCapacity);
    int noOfBuses = max(totalEmployeeCount / minOptimumCapacity, 1);
    vi busCapacities;
    int peopleIncreaseInOptimum = totalEmployeeCount - minOptimumCapacity * noOfBuses;

    f (i, peopleIncreaseInOptimum % noOfBuses)
    {
        busCapacities.push_back(minOptimumCapacity +  peopleIncreaseInOptimum / noOfBuses + 1);
    }
    f (i, noOfBuses - peopleIncreaseInOptimum % noOfBuses) {
        busCapacities.push_back(minOptimumCapacity + peopleIncreaseInOptimum / noOfBuses);
    }
    d2(noOfBuses, minOptimumCapacity);
    // d1(busCapacities.size());

    // if (busCapacities.size() != noOfBuses) {
    //     cerr << "Bus Count Mismatch";
    //     assert(false);
    // }

    int cntAllocatedEmployee = 0;
    f (i, busCapacities.size()) {
        if (busCapacities[i] > busCapacity) {
            if (busCapacities[busCapacities.size() - 1] < busCapacity) {
                busCapacities[busCapacities.size() - 1] += busCapacities[i] - busCapacity;
            }
            else {
                busCapacities.pb(busCapacities[i] - busCapacity);
            }
            busCapacities[i] = busCapacity;
        }
    }

    fstream fout; 
  
    // opens an existing csv file or creates a new file. 
    fout.open("clusters.csv", ios::out ); 
    fout << busCapacities.size() << '\n';
    f (i, busCapacities.size()) {
        fout << busCapacities[i] + 1 << '\n';
        fout << lato << ", " << lono << '\n';
        fa(j, cntAllocatedEmployee, busCapacities[i] + cntAllocatedEmployee - 1) {
            d3(v1[j].first.first, v1[j].first.second, v1[j].second);
            fout << v1[j].first.first 
            << ", " << v1[j].first.second << endl;

        }
        cntAllocatedEmployee += busCapacities[i];
    }

    // cout << calcAngle(1, 1, -5, 9, 100, 100);



}