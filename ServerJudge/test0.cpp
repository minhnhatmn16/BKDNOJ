#include <bits/stdc++.h>
using namespace std;
int x[] = {0, 0, -1, 1};
int y[] = {-1, 1, 0, 0};
char c[] = {'L', 'R', 'U', 'D'};
map<char, int> m;
string s;
bool vis[10][10];
bool ok(int u, int v)
{
    return 1 <= u && u <= 7 && 1 <= v && v <= 7;
}
int truy(int id, int u, int v)
{
    if (vis[u][v - 1] && vis[u][v + 1] && !vis[u - 1][v] && !vis[u + 1][v]) return 0;
    if (!vis[u][v - 1] && !vis[u][v + 1] && vis[u - 1][v] && vis[u + 1][v]) return 0;
    if (u == 7 && v == 1){
        if (id == 48) return 1;
        return 0;
    }
    if (id == 48) return 0;
    vis[u][v] = true;
    int temp = 0;
    if (s[id] == '?')
        for (int i = 0; i <= 3; i++){
            int tx = u + x[i];
            int ty = v + y[i];
            if (!vis[tx][ty]) temp += truy(id + 1, tx, ty);
        }
    else
    {
        int tx = u + x[m[s[id]]];
        int ty = v + y[m[s[id]]];
        if (!vis[tx][ty]) temp += truy(id + 1, tx, ty);
    }
    vis[u][v] = false;
    return temp;
}
int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    m['L'] = 0;
    m['R'] = 1;
    m['U'] = 2;
    m['D'] = 3;
    cin >> s;
    for (int i = 0; i <= 8; i++)
        for (int j = 0; j <= 8; j++)
            if (ok(i, j))
                vis[i][j] = false;
            else
                vis[i][j] = true;
    long long res = truy(0, 1, 1);
    cout << res;
}