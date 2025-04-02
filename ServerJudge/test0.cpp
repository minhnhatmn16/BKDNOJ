#include <bits/stdc++.h>
using namespace std;
int main(){
    string s;
    cin>>s;
    if (s.size()%2==1) {
        cout<<"NO";
        return 0;
    }
    int s1=0,s2=0;
    int d=0;
    for (int i=0; i<s.size(); i++)
    if (i<s.size()/2)
    s1+=s[i]-'0'; else s2+=s[i]-'0';
    if (s1==s2) cout<<"YES"; else cout<<"NO";
}